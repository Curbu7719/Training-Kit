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
//   3. Via service role, aggregate per user a score that tops out at 100 for a
//      learner who completes THEIR OWN path well, and can exceed 100 with extras:
//        base (max 100) = 0.60 * completion  (passed core units / role's core units)
//                       + 0.25 * quality     (avg user_progress.score over core
//                                              units attempted = quiz + exercise)
//                       + 0.15 * exam        (best exam score, 0 if never sat)
//        total_score    = base + 4 * (passed units BEYOND the role's path)
//        badges         = count(user_badges rows)            [tiebreaker]
//        modules_passed = total passed units
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
  const [progressRes, badgesRes, modulesRes, rolePathsRes, examsRes, lessonsRes, reflRes] = await Promise.all([
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
    db.from('completion_reflections').select('user_id, created_at').in('user_id', userIds),
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

  // Curriculum units in code:level form (fallback denominator when a role has
  // no configured path).
  const allUnits = new Set<string>();
  for (const l of lessonsRes.data ?? []) {
    const c = codeById.get(l.module_id);
    if (c) allUnits.add(`${c}:${l.level}`);
  }
  const totalUnits = allUnits.size;

  // The user's OWN path = the admin-managed CORE units for their role. Finishing
  // it well (full completion + quality + exam) maxes the base at 100; passed
  // units BEYOND it add bonus points, so doing extra modules pushes past 100.
  const coreByRole = new Map<string, Set<string>>();
  for (const r of rolePathsRes.data ?? []) {
    const s = coreByRole.get(r.role) ?? new Set<string>();
    s.add(`${r.module_code}:${r.level}`);
    coreByRole.set(r.role, s);
  }
  const roleByUser = new Map<string, string | null>();
  for (const p of profiles) roleByUser.set(p.id, p.learning_role ?? null);

  // Per-user aggregates split into path (core) units vs. extra units.
  type UserAgg = {
    coreAttempted: number; coreScoreSum: number; corePassed: number;
    extraPassed: number; badges: number; passed: Set<string>;
  };
  const agg = new Map<string, UserAgg>();
  for (const uid of userIds) {
    agg.set(uid, { coreAttempted: 0, coreScoreSum: 0, corePassed: 0, extraPassed: 0, badges: 0, passed: new Set() });
  }
  for (const row of progressRes.data ?? []) {
    const entry = agg.get(row.user_id);
    if (!entry) continue;
    const code = codeById.get(row.module_id);
    if (!code) continue;
    const key = `${code}:${row.level}`;
    const coreSet = coreByRole.get(roleByUser.get(row.user_id) ?? '');
    const inCore = coreSet ? coreSet.has(key) : true; // no configured path → treat all as core
    const score = row.score ?? 0;
    if (inCore) {
      entry.coreAttempted += 1;
      entry.coreScoreSum += score;
      if (row.status === 'passed') entry.corePassed += 1;
    } else if (row.status === 'passed') {
      entry.extraPassed += 1;
    }
    if (row.status === 'passed') entry.passed.add(key);
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

  // Training-completion time = when the reflection was first submitted (last step).
  const finishedByUser = new Map<string, string>();
  for (const row of reflRes.data ?? []) finishedByUser.set(row.user_id, row.created_at);

  // Base (max 100) = 60% path completion + 25% quiz+exercise mastery + 15% exam.
  // Each passed unit beyond the path adds BONUS_PER_EXTRA, so totals can exceed 100.
  const W_COMPLETION = 0.60, W_QUALITY = 0.25, W_EXAM = 0.15, BONUS_PER_EXTRA = 4;

  // 4. Build rows with masked display names; note: user IDs are excluded from output
  const rows = profiles.map((p) => {
    const a = agg.get(p.id) ?? { coreAttempted: 0, coreScoreSum: 0, corePassed: 0, extraPassed: 0, badges: 0, passed: new Set<string>() };
    const role: string | null = p.learning_role ?? null;
    const coreSet = role ? coreByRole.get(role) : undefined;
    const certified = !!coreSet && coreSet.size > 0 && [...coreSet].every((key) => a.passed.has(key));

    const coreTotal = coreSet ? coreSet.size : totalUnits;
    const completion = coreTotal ? (a.corePassed / coreTotal) * 100 : 0;
    const quality = a.coreAttempted ? a.coreScoreSum / a.coreAttempted : 0;
    const exam = examBest.get(p.id) ?? 0;
    const base = W_COMPLETION * completion + W_QUALITY * quality + W_EXAM * exam;
    const total_score = Math.round(base + a.extraPassed * BONUS_PER_EXTRA);

    return {
      name:           maskEmail(p.display_name),
      total_score,
      badges:         a.badges,
      modules_passed: a.passed.size,
      role,
      certified,
      finished_at:    finishedByUser.get(p.id) ?? null,
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
