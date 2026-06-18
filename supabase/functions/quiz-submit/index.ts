// quiz-submit/index.ts
//
// POST /quiz-submit
//
// Contract:
//   Request  (JSON body): { quiz_question_id: string, chosen: number[] }
//   Response (JSON):      { is_correct: boolean, correct: number[], points: number }
//
// Flow:
//   1. CORS preflight
//   2. Verify caller JWT → user_id
//   3. Load quiz_questions row via service-role client (reads `correct` column,
//      which is hidden from anon/authenticated roles by column-level REVOKE).
//   4. Grade: set-equality of chosen vs correct.
//   5. INSERT quiz_attempts row.
//   6. Recompute module progress + badge eligibility.
//   7. Return { is_correct, correct, points } — revealing the correct answer
//      after the attempt is intentional (immediate learning feedback).
//
// The client MUST NOT be trusted to send a score; grading is done server-side only.

import { corsHeaders, handleCors } from '../_shared/cors.ts';
import { createServiceClient, verifyJwt } from '../_shared/supabase-client.ts';
import { gradeQuiz } from '../_shared/grading.ts';
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
  let body: { quiz_question_id?: string; chosen?: number[] };
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON body' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const { quiz_question_id, chosen } = body;

  if (!quiz_question_id || !Array.isArray(chosen)) {
    return new Response(
      JSON.stringify({ error: 'quiz_question_id (string) and chosen (number[]) are required' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  }

  const client = createServiceClient();

  // 3. Load the quiz question (service role — reads `correct` column)
  const { data: question, error: qErr } = await client
    .from('quiz_questions')
    .select('id, lesson_id, correct, points')
    .eq('id', quiz_question_id)
    .single();

  if (qErr || !question) {
    return new Response(JSON.stringify({ error: 'Quiz question not found' }), {
      status: 404,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  // 4. Grade
  const correctIndexes = question.correct as number[];
  const isCorrect = gradeQuiz(chosen, correctIndexes);

  // 5. INSERT quiz_attempts
  const { error: insertErr } = await client.from('quiz_attempts').insert({
    user_id: userId,
    quiz_question_id,
    chosen,
    is_correct: isCorrect,
  });

  if (insertErr) {
    return new Response(JSON.stringify({ error: 'Failed to record attempt', detail: insertErr.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  // 6. Recompute module progress
  // Walk up: lesson → module; also get the lesson's level + lang for recompute.
  const { data: lesson } = await client
    .from('lessons')
    .select('module_id, level, lang')
    .eq('id', question.lesson_id)
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
      // Progress recompute failure should not block the grading response.
      // Log and continue so the client still gets its result.
      console.error('Progress recompute error:', _err);
    }
  }

  // 7. Respond — correct indexes are revealed post-attempt for learning feedback
  return new Response(
    JSON.stringify({
      is_correct: isCorrect,
      correct:    correctIndexes,
      points:     isCorrect ? (question.points ?? 1) : 0,
    }),
    { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
  );
});
