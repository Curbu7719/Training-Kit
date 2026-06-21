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
//   3. Via service role, aggregate per user:
//        total_score    = sum(user_progress.score)
//        badges         = count(user_badges rows)
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

// Per-role CORE modules → required level. MUST stay in sync with
// src/lib/rolePaths.ts (only the `core` arrays). 'L1' = baseline pass,
// 'L2' = deep dive. A role is "certified" when every core module here is
// passed at its level.
const CORE_BY_ROLE: Record<string, [string, 'L1' | 'L2'][]> = {
  portfolio_manager: [['llm_foundations', 'L1'], ['ai_delivery_portfolio', 'L2'], ['ai_value_scaling', 'L1'], ['ai_fit_buildbuy', 'L1'], ['ai_risk_governance', 'L1']],
  project_manager: [['llm_foundations', 'L1'], ['ai_delivery_portfolio', 'L1'], ['ai_value_scaling', 'L1'], ['ai_risk_governance', 'L1']],
  governance: [['llm_foundations', 'L1'], ['ai_risk_governance', 'L1'], ['security_privacy', 'L1'], ['guardrails', 'L1']],
  developer: [['llm_foundations', 'L1'], ['tokens', 'L1'], ['prompting', 'L1'], ['context_management', 'L1'], ['tool_use_agents', 'L1'], ['rag', 'L1'], ['evaluation', 'L1'], ['vibe_coding', 'L1']],
  designer: [['llm_foundations', 'L1'], ['prompting', 'L1'], ['context_management', 'L1'], ['guardrails', 'L1']],
  enterprise_architect: [['llm_foundations', 'L1'], ['ai_architecture', 'L1'], ['ai_fit_buildbuy', 'L1'], ['rag', 'L1'], ['tool_use_agents', 'L1'], ['security_privacy', 'L1'], ['cost_latency', 'L1']],
  tester: [['llm_foundations', 'L1'], ['evaluation', 'L1'], ['guardrails', 'L1'], ['prompting', 'L1']],
  release_manager: [['llm_foundations', 'L1'], ['ai_operations_sre', 'L1'], ['evaluation', 'L1'], ['ai_delivery_portfolio', 'L1']],
  devops_engineer: [['llm_foundations', 'L1'], ['tokens', 'L1'], ['ai_operations_sre', 'L1'], ['cost_latency', 'L1'], ['evaluation', 'L1']],
  infrastructure_engineer: [['llm_foundations', 'L1'], ['tokens', 'L1'], ['cost_latency', 'L1'], ['ai_operations_sre', 'L1'], ['ai_architecture', 'L1']],
  security_engineer: [['llm_foundations', 'L1'], ['security_privacy', 'L1'], ['guardrails', 'L1'], ['ai_risk_governance', 'L1']],
};

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
  const [progressRes, badgesRes, modulesRes] = await Promise.all([
    db.from('user_progress')
      .select('user_id, status, score, module_id, level')
      .in('user_id', userIds),
    db.from('user_badges')
      .select('user_id, badge_id')
      .in('user_id', userIds),
    db.from('modules').select('id, code'),
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

  // Build per-user aggregates + a set of passed "code:level" keys for cert check.
  type UserAgg = { total_score: number; badges: number; modules_passed: number; passed: Set<string> };
  const agg = new Map<string, UserAgg>();
  for (const uid of userIds) {
    agg.set(uid, { total_score: 0, badges: 0, modules_passed: 0, passed: new Set() });
  }
  for (const row of progressRes.data ?? []) {
    const entry = agg.get(row.user_id);
    if (!entry) continue;
    entry.total_score += row.score ?? 0;
    if (row.status === 'passed') {
      entry.modules_passed += 1;
      const code = codeById.get(row.module_id);
      if (code) entry.passed.add(`${code}:${row.level}`);
    }
  }
  for (const row of badgesRes.data ?? []) {
    const entry = agg.get(row.user_id);
    if (entry) entry.badges += 1;
  }

  // 4. Build rows with masked display names; note: user IDs are excluded from output
  const rows = profiles.map((p) => {
    const a = agg.get(p.id) ?? { total_score: 0, badges: 0, modules_passed: 0, passed: new Set<string>() };
    const role: string | null = p.learning_role ?? null;
    const core = role ? CORE_BY_ROLE[role] : undefined;
    const certified = !!core && core.length > 0 && core.every(([code, lvl]) => a.passed.has(`${code}:${lvl}`));
    return {
      name:           maskEmail(p.display_name),
      total_score:    a.total_score,
      badges:         a.badges,
      modules_passed: a.modules_passed,
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
