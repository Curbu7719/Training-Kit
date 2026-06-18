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
//        total_score   = sum(user_progress.score)
//        badges        = count(user_badges rows)
//        modules_passed = count(user_progress rows where status='passed')
//   4. Join profiles.display_name; mask email-shaped display names.
//   5. Return top 50 ordered by total_score desc, then badges desc.
//
// Response: { ok: true, data: [{rank, name, total_score, badges, modules_passed}] }
//
// Email masking: if display_name matches an email pattern, only the local-part
// (before @) is returned. user IDs are never included in the response.

import { corsHeaders, handleCors } from '../_shared/cors.ts';
import { createServiceClient, verifyJwt } from '../_shared/supabase-client.ts';

// ---------------------------------------------------------------------------
// Pure helper — testable with no I/O
// ---------------------------------------------------------------------------

/**
 * Mask a display name that looks like an email address.
 * Returns the local-part (before @) if the value matches a basic email pattern,
 * otherwise returns the value unchanged.
 *
 * Examples:
 *   "jane.doe@example.com" → "jane.doe"
 *   "Alice"                → "Alice"
 *   "alice@"               → "alice@"  (malformed — no domain, left as-is)
 */
export function maskEmail(displayName: string | null | undefined): string {
  if (!displayName) return 'Anonymous';
  // Match a simple email: something@something.something
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (emailPattern.test(displayName)) {
    return displayName.split('@')[0];
  }
  return displayName;
}

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

  // 3. Fetch all profiles (display_name) — service role bypasses RLS
  const { data: profiles, error: profileErr } = await db
    .from('profiles')
    .select('id, display_name');

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

  // Aggregate progress and badges — service role reads across all users
  const [progressRes, badgesRes] = await Promise.all([
    db.from('user_progress')
      .select('user_id, status, score')
      .in('user_id', userIds),
    db.from('user_badges')
      .select('user_id, badge_id')
      .in('user_id', userIds),
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

  // Build per-user aggregates
  type UserAgg = { total_score: number; badges: number; modules_passed: number };
  const agg = new Map<string, UserAgg>();
  for (const uid of userIds) {
    agg.set(uid, { total_score: 0, badges: 0, modules_passed: 0 });
  }
  for (const row of progressRes.data ?? []) {
    const entry = agg.get(row.user_id);
    if (!entry) continue;
    entry.total_score += row.score ?? 0;
    if (row.status === 'passed') entry.modules_passed += 1;
  }
  for (const row of badgesRes.data ?? []) {
    const entry = agg.get(row.user_id);
    if (entry) entry.badges += 1;
  }

  // 4. Build rows with masked display names; note: user IDs are excluded from output
  const rows = profiles.map((p) => {
    const a = agg.get(p.id) ?? { total_score: 0, badges: 0, modules_passed: 0 };
    return {
      name:           maskEmail(p.display_name),
      total_score:    a.total_score,
      badges:         a.badges,
      modules_passed: a.modules_passed,
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
