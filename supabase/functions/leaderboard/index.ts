// leaderboard/index.ts
//
// GET or POST /leaderboard
//
// Any authenticated user may call this endpoint; 401 if no valid JWT.
// Admin or service-role is NOT required — leaderboard is public to all
// signed-in users, but raw emails and user IDs are never returned.
//
// Flow:
//   1. CORS preflight.
//   2. Verify caller JWT (any authenticated user).
//   3. Via service role, aggregate per user a weighted 0-100 score:
//        total_score = 0.60 * completion  (passed units / ALL curriculum units,
//                                           so extra modules beyond the path help)
//                    + 0.25 * quality     (avg user_progress.score over attempted
//                                           units = quiz + exercise mastery)
//                    + 0.15 * exam        (best exam score, 0 if never sat)
//        badges         = count(user_badges rows)            [tiebreaker]
//        modules_passed = count(user_progress rows where status='passed')
//        role           = profiles.learning_role
//        certified      = all of the role's CORE modules passed at the required level
//   4. Join profiles.display_name; mask email-shaped display names.
//   5. Return top 50 ordered by total_score desc, then badges desc.
//
// Response: { ok: true, data: [{rank, name, total_score, badges, modules_passed, role, certified}] }
//
// Email masking: if display_name matches an email pattern, only the local-part
// (before @) is returned. user IDs are never included in the response.

import { corsHeaders, handleCors } from '../_shared/cors.ts';
import { createServiceClient, verifyJwt } from '../_shared/supabase-client.ts';
import { maskEmail } from '../_shared/leaderboard-helpers.ts';

export { maskEmail };

// Per-role CORE modules now live in the admin-managed `role_paths` table and
// are loaded at request time (see below). A role is "certified" when every
// core module for that role is passed at its required level.

// ---------------------------------------------------------------------------
// Entry point
// ---------------------------------------------------------------------------

Deno.serve(async (req: Request) => {
  // 1. CORS preflight
  const preflight = handleCors(req);
  if (preflight) return preflight;

  // 2. Verify JWT — any authenticated user; 401 if none
  try {
    await verifyJwt(req);
  } catch (errResponse) {
    return errResponse as Response;
  }

  const db = createServiceClient();

  // 3. Fetch all profiles (display_name + learning_role) — service role bypasses RLS
  const { data: profiles, error: profileErr } = await db
    .from('profiles')
    .select('id, display_name, learning_role');

  if (profileErr) {
    return new Response(
      JSON.stringify({ ok: false, error: profileErr.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  }

  if (!profiles || profiles.length === 0) {
    return new Response(
      JSON.stringify({ ok: true, data: [] }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  }

  const userIds = profiles.map((p) => p.id);

  // Aggregate progress + badges + module id→code (for role-cert computation)
  const [progressRes, badgesRes, modulesRes, rolePathsRes, examsRes, lessonsRes] = await Promise.all([
    db.from('user_progress')
      .select('user_id, status, score, module_id, level')
      .in('user_id', userIds),
    db.from('user_badges')
      .select('user_id, badge_id')
      .in('user_id', userIds),
    db.from('modules').select('id, code'),
    db.from('role_paths').select('role, module_code, level, kind').eq('kind', 'core'),
    db.from('exam_results').select('user_id, score').in('user_id', userIds),
    db.from('lessons').select('module_id, level'),
  ]);

  if (progressRes.error) {
    return new Response(
      JSON.stringify({ ok: false, error: progressRes.error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  }
  if (badgesRes.error) {
    return new Response(
      JSON.stringify({ ok: false, error: badgesRes.error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  }

  const codeById = new Map<string, string>();
  for (const m of modulesRes.data ?? []) codeById.set(m.id, m.code);

  // Total curriculum units = distinct (module, level) pairs that have lessons.
  // Completion is measured against ALL of them, so finishing extra modules/levels
  // beyond your role path raises your completion component.
  const allUnits = new Set<string>();
  for (const l of lessonsRes.data ?? []) allUnits.add(`${l.module_id}:${l.level}`);
  const totalUnits = allUnits.size;

  // Admin-managed core modules per role: role → [code:level, ...]
  const coreByRole = new Map<string, string[]>();
  for (const r of rolePathsRes.data ?? []) {
    const list = coreByRole.get(r.role) ?? [];
    list.push(`${r.module_code}:${r.level}`);
    coreByRole.set(r.role, list);
  }

  // Per-user aggregates: summed/attempted score (for quiz+exercise quality),
  // passed-unit count (for completion) and a passed "code:level" set (for cert).
  type UserAgg = { sumScore: number; attempted: number; passedCount: number; badges: number; passed: Set<string> };
  const agg = new Map<string, UserAgg>();
  for (const uid of userIds) {
    agg.set(uid, { sumScore: 0, attempted: 0, passedCount: 0, badges: 0, passed: new Set() });
  }
  for (const row of progressRes.data ?? []) {
    const entry = agg.get(row.user_id);
    if (!entry) continue;
    entry.sumScore += row.score ?? 0;
    entry.attempted += 1;
    if (row.status === 'passed') {
      entry.passedCount += 1;
      const code = codeById.get(row.module_id);
      if (code) entry.passed.add(`${code}:${row.level}`);
    }
  }
  for (const row of badgesRes.data ?? []) {
    const entry = agg.get(row.user_id);
    if (entry) entry.badges += 1;
  }

  // Best exam score per user (0-100), or 0 if never sat.
  const examBest = new Map<string, number>();
  for (const row of examsRes.data ?? []) {
    if ((examBest.get(row.user_id) ?? -1) < row.score) examBest.set(row.user_id, row.score);
  }

  // Weighted 0-100 composite: 60% module completion (vs the whole curriculum),
  // 25% quiz+exercise mastery (avg score over attempted units), 15% best exam.
  const W_COMPLETION = 0.60, W_QUALITY = 0.25, W_EXAM = 0.15;

  // 4. Build rows with masked display names; note: user IDs are excluded from output
  const rows = profiles.map((p) => {
    const a = agg.get(p.id) ?? { sumScore: 0, attempted: 0, passedCount: 0, badges: 0, passed: new Set<string>() };
    const role: string | null = p.learning_role ?? null;
    const core = role ? coreByRole.get(role) : undefined;
    const certified = !!core && core.length > 0 && core.every((key) => a.passed.has(key));

    const completion = totalUnits ? (a.passedCount / totalUnits) * 100 : 0;
    const quality = a.attempted ? a.sumScore / a.attempted : 0;
    const exam = examBest.get(p.id) ?? 0;
    const total_score = Math.round(W_COMPLETION * completion + W_QUALITY * quality + W_EXAM * exam);

    return {
      name:           maskEmail(p.display_name),
      total_score,
      badges:         a.badges,
      modules_passed: a.passedCount,
      role,
      certified,
    };
  });

  // 5. Sort: total_score desc, then badges desc; take top 50
  rows.sort((a, b) => {
    if (b.total_score !== a.total_score) return b.total_score - a.total_score;
    return b.badges - a.badges;
  });

  const top50 = rows.slice(0, 50).map((row, i) => ({
    rank: i + 1,
    ...row,
  }));

  return new Response(
    JSON.stringify({ ok: true, data: top50 }),
    { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
  );
});
