// exercise-submit/index.ts
//
// POST /exercise-submit
//
// Contract:
//   Request (JSON body):
//     { exercise_id: string, answer: <type-specific shape> }
//
//   Answer shapes per exercise type (per docs/CONTENT-GUIDE.md):
//     mcq      → { selected: number[] }
//     order    → { order: number[] }
//     match    → { pairs: [number, number][] }
//     fill     → { values: string[] }
//     scenario → { decision: number, reason: number }
//
//   Response (JSON):
//     { score: number, max_score: number, passed: boolean }
//
// Flow:
//   1. CORS preflight
//   2. Verify caller JWT → user_id
//   3. Load exercises row via service-role client (reads `answer_key` and `type`,
//      which are hidden from anon/authenticated by column-level REVOKE on answer_key).
//   4. Grade with _shared/grading.ts dispatcher.
//   5. INSERT exercise_subs row (user-submitted answer, server-computed score).
//   6. Recompute module progress + badge eligibility.
//   7. Return { score, max_score, passed }.
//
// The client MUST NOT be trusted to send a score; grading is always server-side.

import { corsHeaders, handleCors } from '../_shared/cors.ts';
import { createServiceClient, verifyJwt } from '../_shared/supabase-client.ts';
import { gradeExercise, type ExerciseAnswer, type AnswerKey, type ExerciseType } from '../_shared/grading.ts';
import { recomputeModuleProgress, type ModuleLevel, type LangCode } from '../_shared/recompute.ts';

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

  // Parse body
  let body: { exercise_id?: string; answer?: unknown };
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON body' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const { exercise_id, answer } = body;

  if (!exercise_id || answer === undefined || answer === null) {
    return new Response(
      JSON.stringify({ error: 'exercise_id (string) and answer (object) are required' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  }

  const client = createServiceClient();

  // 3. Load the exercise (service role — reads `answer_key` column)
  const { data: exercise, error: exErr } = await client
    .from('exercises')
    .select('id, lesson_id, type, answer_key, max_score')
    .eq('id', exercise_id)
    .single();

  if (exErr || !exercise) {
    return new Response(JSON.stringify({ error: 'Exercise not found' }), {
      status: 404,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  // 4. Grade
  let result: { score: number; passed: boolean };
  try {
    result = gradeExercise(
      exercise.type as ExerciseType,
      answer as ExerciseAnswer,
      exercise.answer_key as AnswerKey,
      exercise.max_score ?? 10,
    );
  } catch (gradingErr) {
    return new Response(
      JSON.stringify({ error: 'Grading failed', detail: String(gradingErr) }),
      { status: 422, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  }

  // 5. INSERT exercise_subs (server-computed score, never client-provided)
  const { error: insertErr } = await client.from('exercise_subs').insert({
    user_id:     userId,
    exercise_id,
    answer,
    score:       result.score,
    passed:      result.passed,
  });

  if (insertErr) {
    return new Response(
      JSON.stringify({ error: 'Failed to record submission', detail: insertErr.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  }

  // 6. Recompute module progress
  const { data: lesson } = await client
    .from('lessons')
    .select('module_id, level, lang')
    .eq('id', exercise.lesson_id)
    .single();

  if (lesson) {
    try {
      await recomputeModuleProgress(
        client,
        userId,
        lesson.module_id,
        lesson.level as ModuleLevel,
        lesson.lang as LangCode,
      );
    } catch (_err) {
      console.error('Progress recompute error:', _err);
    }
  }

  // 7. Respond
  return new Response(
    JSON.stringify({
      score:     result.score,
      max_score: exercise.max_score ?? 10,
      passed:    result.passed,
    }),
    { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
  );
});
