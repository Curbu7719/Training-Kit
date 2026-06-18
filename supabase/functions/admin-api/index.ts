// admin-api/index.ts
//
// POST /admin-api
//
// Admin-gated edge function. Every request:
//   1. Handle CORS preflight.
//   2. Verify caller JWT → user_id.
//   3. Load profiles.role via service role; reject non-admins with 403.
//   4. Dispatch on body.action.
//
// Actions:
//   list_modules        → [{id, code, title, sort_order, l1_lessons, l2_lessons, quiz_count, exercise_count}]
//   get_module_full     → {code} → module + all lessons (L1+L2) + quiz_questions (with correct) + exercises (with answer_key)
//   update_lesson       → {id, title?, body_md?} → updated lesson row
//   update_quiz_question → {id, prompt?, choices?, correct?, points?} → updated row (validates correct indexes)
//   update_exercise     → {id, prompt_md?, spec?, answer_key?, max_score?} → updated row
//   list_users          → [{id, display_name, role, active_track, modules_passed, total_score, badge_count}]
//
// Response shape:
//   success: { ok: true, data: <payload> }
//   error:   { ok: false, error: <message> }   with status 400 | 401 | 403 | 500
//
// Admin bootstrap: set profiles.role='admin' via SQL — there is no self-service
// promotion. This function never elevates privileges; it only reads and enforces.

import { corsHeaders, handleCors } from '../_shared/cors.ts';
import { createServiceClient, verifyJwt } from '../_shared/supabase-client.ts';
import { validateCorrectIndexes } from '../_shared/admin-helpers.ts';

export { validateCorrectIndexes };

// ---------------------------------------------------------------------------
// Action handlers — each receives the service client, the parsed body, and
// returns a { status, payload } tuple so the dispatcher stays thin.
// ---------------------------------------------------------------------------

type HandlerResult = { status: number; payload: unknown };

async function listModules(db: ReturnType<typeof createServiceClient>): Promise<HandlerResult> {
  const { data: modules, error } = await db
    .from('modules')
    .select('id, code, title, sort_order')
    .order('sort_order', { ascending: true });

  if (error) {
    return { status: 500, payload: { ok: false, error: error.message } };
  }

  // Fetch lesson / quiz / exercise counts per module in parallel
  const enriched = await Promise.all(
    (modules ?? []).map(async (mod) => {
      const [l1Res, l2Res, quizRes, exerciseRes] = await Promise.all([
        db.from('lessons').select('id', { count: 'exact', head: true })
          .eq('module_id', mod.id).eq('level', 'L1'),
        db.from('lessons').select('id', { count: 'exact', head: true })
          .eq('module_id', mod.id).eq('level', 'L2'),
        // quiz_questions join through lessons — count questions whose lesson belongs to this module
        db.from('quiz_questions')
          .select('id, lessons!inner(module_id)', { count: 'exact', head: true })
          .eq('lessons.module_id', mod.id),
        db.from('exercises')
          .select('id, lessons!inner(module_id)', { count: 'exact', head: true })
          .eq('lessons.module_id', mod.id),
      ]);
      return {
        id:             mod.id,
        code:           mod.code,
        title:          mod.title,
        sort_order:     mod.sort_order,
        l1_lessons:     l1Res.count ?? 0,
        l2_lessons:     l2Res.count ?? 0,
        quiz_count:     quizRes.count ?? 0,
        exercise_count: exerciseRes.count ?? 0,
      };
    }),
  );

  return { status: 200, payload: { ok: true, data: enriched } };
}

async function getModuleFull(
  db: ReturnType<typeof createServiceClient>,
  body: Record<string, unknown>,
): Promise<HandlerResult> {
  const code = body.code;
  if (typeof code !== 'string' || !code) {
    return { status: 400, payload: { ok: false, error: '`code` (string) is required for get_module_full' } };
  }

  const { data: mod, error: modErr } = await db
    .from('modules')
    .select('id, code, title, concept_md, sort_order, created_at')
    .eq('code', code)
    .single();

  if (modErr || !mod) {
    return { status: 400, payload: { ok: false, error: `Module not found: ${code}` } };
  }

  // Fetch lessons — both levels, ordered
  const { data: lessons, error: lessonErr } = await db
    .from('lessons')
    .select('id, module_id, kind, level, title, body_md, sort_order, created_at')
    .eq('module_id', mod.id)
    .order('level', { ascending: true })
    .order('sort_order', { ascending: true });

  if (lessonErr) {
    return { status: 500, payload: { ok: false, error: lessonErr.message } };
  }

  const lessonIds = (lessons ?? []).map((l) => l.id);

  // Fetch quiz_questions WITH correct (service role bypasses column-level REVOKE)
  const { data: quizQuestions, error: qqErr } = await db
    .from('quiz_questions')
    .select('id, lesson_id, prompt, choices, correct, points, created_at')
    .in('lesson_id', lessonIds.length > 0 ? lessonIds : ['00000000-0000-0000-0000-000000000000'])
    .order('created_at', { ascending: true });

  if (qqErr) {
    return { status: 500, payload: { ok: false, error: qqErr.message } };
  }

  // Fetch exercises WITH answer_key
  const { data: exercises, error: exErr } = await db
    .from('exercises')
    .select('id, lesson_id, type, prompt_md, spec, answer_key, max_score, created_at')
    .in('lesson_id', lessonIds.length > 0 ? lessonIds : ['00000000-0000-0000-0000-000000000000'])
    .order('created_at', { ascending: true });

  if (exErr) {
    return { status: 500, payload: { ok: false, error: exErr.message } };
  }

  return {
    status: 200,
    payload: {
      ok: true,
      data: {
        module:          mod,
        lessons:         lessons ?? [],
        quiz_questions:  quizQuestions ?? [],
        exercises:       exercises ?? [],
      },
    },
  };
}

async function updateLesson(
  db: ReturnType<typeof createServiceClient>,
  body: Record<string, unknown>,
): Promise<HandlerResult> {
  const id = body.id;
  if (typeof id !== 'string' || !id) {
    return { status: 400, payload: { ok: false, error: '`id` (string) is required for update_lesson' } };
  }

  const patch: Record<string, unknown> = {};
  if (typeof body.title   === 'string') patch.title   = body.title;
  if (typeof body.body_md === 'string') patch.body_md = body.body_md;

  if (Object.keys(patch).length === 0) {
    return { status: 400, payload: { ok: false, error: 'At least one of `title` or `body_md` must be provided' } };
  }

  const { data, error } = await db
    .from('lessons')
    .update(patch)
    .eq('id', id)
    .select('id, module_id, kind, level, title, body_md, sort_order, created_at')
    .single();

  if (error) {
    return { status: 500, payload: { ok: false, error: error.message } };
  }
  if (!data) {
    return { status: 400, payload: { ok: false, error: `Lesson not found: ${id}` } };
  }

  return { status: 200, payload: { ok: true, data } };
}

async function updateQuizQuestion(
  db: ReturnType<typeof createServiceClient>,
  body: Record<string, unknown>,
): Promise<HandlerResult> {
  const id = body.id;
  if (typeof id !== 'string' || !id) {
    return { status: 400, payload: { ok: false, error: '`id` (string) is required for update_quiz_question' } };
  }

  const patch: Record<string, unknown> = {};
  if (typeof body.prompt === 'string') patch.prompt = body.prompt;
  if (Array.isArray(body.choices))     patch.choices = body.choices;
  if (Array.isArray(body.correct))     patch.correct = body.correct;
  if (typeof body.points === 'number') patch.points  = body.points;

  if (Object.keys(patch).length === 0) {
    return { status: 400, payload: { ok: false, error: 'At least one field must be provided to update' } };
  }

  // If correct is being updated, we need choices to validate indexes.
  // Load existing row to get current choices when only correct changes.
  if (patch.correct !== undefined) {
    let choicesForValidation = patch.choices;

    if (choicesForValidation === undefined) {
      // choices not in this request — load the existing row
      const { data: existing, error: fetchErr } = await db
        .from('quiz_questions')
        .select('choices')
        .eq('id', id)
        .single();

      if (fetchErr || !existing) {
        return { status: 400, payload: { ok: false, error: `Quiz question not found: ${id}` } };
      }
      choicesForValidation = existing.choices;
    }

    const validationError = validateCorrectIndexes(choicesForValidation, patch.correct);
    if (validationError) {
      return { status: 400, payload: { ok: false, error: validationError } };
    }
  }

  const { data, error } = await db
    .from('quiz_questions')
    .update(patch)
    .eq('id', id)
    .select('id, lesson_id, prompt, choices, correct, points, created_at')
    .single();

  if (error) {
    return { status: 500, payload: { ok: false, error: error.message } };
  }
  if (!data) {
    return { status: 400, payload: { ok: false, error: `Quiz question not found: ${id}` } };
  }

  return { status: 200, payload: { ok: true, data } };
}

async function updateExercise(
  db: ReturnType<typeof createServiceClient>,
  body: Record<string, unknown>,
): Promise<HandlerResult> {
  const id = body.id;
  if (typeof id !== 'string' || !id) {
    return { status: 400, payload: { ok: false, error: '`id` (string) is required for update_exercise' } };
  }

  const patch: Record<string, unknown> = {};
  if (typeof body.prompt_md  === 'string') patch.prompt_md  = body.prompt_md;
  if (body.spec       !== undefined)        patch.spec       = body.spec;
  if (body.answer_key !== undefined)        patch.answer_key = body.answer_key;
  if (typeof body.max_score === 'number')   patch.max_score  = body.max_score;

  if (Object.keys(patch).length === 0) {
    return { status: 400, payload: { ok: false, error: 'At least one field must be provided to update' } };
  }

  const { data, error } = await db
    .from('exercises')
    .update(patch)
    .eq('id', id)
    .select('id, lesson_id, type, prompt_md, spec, answer_key, max_score, created_at')
    .single();

  if (error) {
    return { status: 500, payload: { ok: false, error: error.message } };
  }
  if (!data) {
    return { status: 400, payload: { ok: false, error: `Exercise not found: ${id}` } };
  }

  return { status: 200, payload: { ok: true, data } };
}

async function listUsers(db: ReturnType<typeof createServiceClient>): Promise<HandlerResult> {
  // Fetch all profiles — service role bypasses RLS so this is a cross-user read
  const { data: profiles, error: profileErr } = await db
    .from('profiles')
    .select('id, display_name, role, active_track')
    .order('display_name', { ascending: true });

  if (profileErr) {
    return { status: 500, payload: { ok: false, error: profileErr.message } };
  }

  if (!profiles || profiles.length === 0) {
    return { status: 200, payload: { ok: true, data: [] } };
  }

  const userIds = profiles.map((p) => p.id);

  // Aggregate progress and badges for all users in two queries
  const [progressRes, badgesRes] = await Promise.all([
    db.from('user_progress')
      .select('user_id, status, score')
      .in('user_id', userIds),
    db.from('user_badges')
      .select('user_id, badge_id')
      .in('user_id', userIds),
  ]);

  if (progressRes.error) {
    return { status: 500, payload: { ok: false, error: progressRes.error.message } };
  }
  if (badgesRes.error) {
    return { status: 500, payload: { ok: false, error: badgesRes.error.message } };
  }

  // Build per-user aggregates
  type UserAgg = { modules_passed: number; total_score: number; badge_count: number };
  const agg = new Map<string, UserAgg>();
  for (const uid of userIds) {
    agg.set(uid, { modules_passed: 0, total_score: 0, badge_count: 0 });
  }
  for (const row of progressRes.data ?? []) {
    const entry = agg.get(row.user_id);
    if (!entry) continue;
    entry.total_score += row.score ?? 0;
    if (row.status === 'passed') entry.modules_passed += 1;
  }
  for (const row of badgesRes.data ?? []) {
    const entry = agg.get(row.user_id);
    if (entry) entry.badge_count += 1;
  }

  const data = profiles.map((p) => {
    const a = agg.get(p.id) ?? { modules_passed: 0, total_score: 0, badge_count: 0 };
    return {
      id:             p.id,
      display_name:   p.display_name,
      role:           p.role,
      active_track:   p.active_track,
      modules_passed: a.modules_passed,
      total_score:    a.total_score,
      badge_count:    a.badge_count,
    };
  });

  return { status: 200, payload: { ok: true, data } };
}

// ---------------------------------------------------------------------------
// Entry point
// ---------------------------------------------------------------------------

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

  // 3. Verify admin role via service client (bypasses RLS — cross-user read)
  const db = createServiceClient();
  const { data: profile, error: profileErr } = await db
    .from('profiles')
    .select('role')
    .eq('id', userId)
    .single();

  if (profileErr || !profile) {
    return new Response(
      JSON.stringify({ ok: false, error: 'Could not load user profile' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  }

  if (profile.role !== 'admin') {
    return new Response(
      JSON.stringify({ ok: false, error: 'Forbidden — admin role required' }),
      { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  }

  // 4. Parse body
  let body: Record<string, unknown> = {};
  try {
    const text = await req.text();
    if (text) body = JSON.parse(text);
  } catch {
    return new Response(
      JSON.stringify({ ok: false, error: 'Invalid JSON body' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  }

  const action = body.action;
  if (typeof action !== 'string' || !action) {
    return new Response(
      JSON.stringify({ ok: false, error: '`action` (string) is required' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  }

  // 5. Dispatch
  let result: HandlerResult;
  switch (action) {
    case 'list_modules':
      result = await listModules(db);
      break;
    case 'get_module_full':
      result = await getModuleFull(db, body);
      break;
    case 'update_lesson':
      result = await updateLesson(db, body);
      break;
    case 'update_quiz_question':
      result = await updateQuizQuestion(db, body);
      break;
    case 'update_exercise':
      result = await updateExercise(db, body);
      break;
    case 'list_users':
      result = await listUsers(db);
      break;
    default:
      result = { status: 400, payload: { ok: false, error: `Unknown action: ${action}` } };
  }

  return new Response(
    JSON.stringify(result.payload),
    { status: result.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
  );
});
