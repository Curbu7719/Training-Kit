// progress/index.ts
//
// POST /progress
//
// Contract:
//   Request (JSON body):
//     { module_id?: string, level?: 'L1' | 'L2' }
//     — If both omitted: recompute ALL of the user's in-scope modules
//       (all module_tracks rows for the user's active_track + any modules
//       with existing user_progress rows, to avoid leaving stale data).
//     — If module_id provided (with level): recompute just that one.
//
//   Response (JSON):
//     {
//       progress: [{ module_id: string, level: 'L1'|'L2', status: string, score: number }],
//       newBadges: string[]
//     }
//
// Flow:
//   1. CORS preflight
//   2. Verify caller JWT → user_id
//   3. Determine scope: single module or all in-scope modules.
//   4. For each (module_id, level) pair, call recomputeModuleProgress().
//   5. Collect all new badge codes.
//   6. Fetch and return the full updated progress rows.

import { corsHeaders, handleCors } from '../_shared/cors.ts';
import { createServiceClient, verifyJwt } from '../_shared/supabase-client.ts';
import { recomputeModuleProgress, type ModuleLevel } from '../_shared/recompute.ts';

Deno.serve(async (req: Request) => {
  // 1. CORS preflight
  const preflight = handleCors(req);
  if (preflight) return preflight;

  // 2. Verify JWT
  let userId: string;
  try {
    userId = await verifyJwt(req);
  } catch (errResponse) {
    return errResponse as Response;
  }

  // Parse optional body
  let body: { module_id?: string; level?: string } = {};
  try {
    const text = await req.text();
    if (text) body = JSON.parse(text);
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON body' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const client = createServiceClient();

  // 3. Determine scope
  type ScopeItem = { module_id: string; level: ModuleLevel };
  let scope: ScopeItem[] = [];

  if (body.module_id && body.level) {
    // Single module requested
    scope = [{ module_id: body.module_id, level: body.level as ModuleLevel }];
  } else {
    // All in-scope modules for the user's active track
    // + any modules with an existing user_progress row (to keep them current)
    const { data: profile } = await client
      .from('profiles')
      .select('active_track')
      .eq('id', userId)
      .single();

    const activeTrack: string | null = profile?.active_track ?? null;

    if (activeTrack) {
      // Resolve track id
      const { data: track } = await client
        .from('tracks')
        .select('id')
        .eq('code', activeTrack)
        .single();

      if (track) {
        const { data: trackModules } = await client
          .from('module_tracks')
          .select('module_id, level')
          .eq('track_id', track.id);

        for (const row of trackModules ?? []) {
          scope.push({ module_id: row.module_id, level: row.level as ModuleLevel });
        }
      }
    }

    // Also include any existing progress rows not already in scope
    const { data: existingProgress } = await client
      .from('user_progress')
      .select('module_id, level')
      .eq('user_id', userId);

    const inScope = new Set(scope.map((s) => `${s.module_id}:${s.level}`));
    for (const row of existingProgress ?? []) {
      const key = `${row.module_id}:${row.level}`;
      if (!inScope.has(key)) {
        scope.push({ module_id: row.module_id, level: row.level as ModuleLevel });
        inScope.add(key);
      }
    }
  }

  // 4. Recompute each module in scope
  const allNewBadges: string[] = [];

  for (const { module_id, level } of scope) {
    try {
      const newBadges = await recomputeModuleProgress(client, userId, module_id, level);
      allNewBadges.push(...newBadges);
    } catch (err) {
      console.error(`Recompute failed for module=${module_id} level=${level}:`, err);
      // Continue with remaining modules rather than failing the whole response
    }
  }

  // 5. Fetch updated progress rows to return to caller
  let progressQuery = client
    .from('user_progress')
    .select('module_id, level, status, score')
    .eq('user_id', userId);

  if (body.module_id && body.level) {
    progressQuery = progressQuery
      .eq('module_id', body.module_id)
      .eq('level', body.level);
  }

  const { data: progressRows, error: progressErr } = await progressQuery;

  if (progressErr) {
    return new Response(
      JSON.stringify({ error: 'Failed to load progress', detail: progressErr.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  }

  return new Response(
    JSON.stringify({
      progress:   progressRows ?? [],
      newBadges:  allNewBadges,
    }),
    { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
  );
});
