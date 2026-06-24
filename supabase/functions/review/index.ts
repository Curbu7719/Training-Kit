// review/index.ts
//
// POST /review
//
// Contract:
//   Request  (JSON body): { module_id: string, level: 'L1' | 'L2', lang?: 'en'|'tr' }
//   Response (JSON):
//     {
//       lessons: [
//         { lesson_id, kind: 'quiz',
//           questions: [{ id, prompt, choices, points, chosen, is_correct, correct, explanation }] },
//         { lesson_id, kind: 'exercise',
//           exercise: { id, type, prompt_md, spec, max_score, answer, score, passed, answer_key } },
//       ]
//     }
//
// Lets a learner revisit a level they've worked on and see their own previous
// answers next to the correct ones. Correct keys (quiz_questions.correct,
// exercises.answer_key) and quiz explanations are server-only, so this function
// reads them with the service role and returns them ONLY for items the user has
// actually attempted — preserving the "no answer key before you answer" rule.

import { corsHeaders, handleCors } from '../_shared/cors.ts';
import { createServiceClient, verifyJwt } from '../_shared/supabase-client.ts';

Deno.serve(async (req: Request) => {
  const preflight = handleCors(req);
  if (preflight) return preflight;

  let userId: string;
  try {
    userId = await verifyJwt(req);
  } catch (errResponse) {
    return errResponse as Response;
  }

  let body: { module_id?: string; level?: string; lang?: string };
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON body' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const moduleId = body.module_id;
  const level = body.level === 'L2' ? 'L2' : 'L1';
  const lang = body.lang === 'tr' ? 'tr' : 'en';
  if (!moduleId) {
    return new Response(JSON.stringify({ error: 'module_id is required' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const client = createServiceClient();

  // Quiz + exercise lessons for this module/level/lang, in order.
  const { data: lessons, error: lErr } = await client
    .from('lessons')
    .select('id, kind, sort_order')
    .eq('module_id', moduleId)
    .eq('lang', lang)
    .eq('level', level)
    .in('kind', ['quiz', 'exercise'])
    .order('sort_order');
  if (lErr) {
    return new Response(JSON.stringify({ error: 'Failed to load lessons', detail: lErr.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const lessonRows = lessons ?? [];
  const quizLessonIds = lessonRows.filter((l) => l.kind === 'quiz').map((l) => l.id);
  const exLessonIds = lessonRows.filter((l) => l.kind === 'exercise').map((l) => l.id);

  // --- Quiz questions + this user's latest attempt per question -------------
  const questionsByLesson = new Map<string, unknown[]>();
  if (quizLessonIds.length > 0) {
    const { data: questions } = await client
      .from('quiz_questions')
      .select('id, lesson_id, prompt, choices, correct, points, explanation')
      .in('lesson_id', quizLessonIds);

    const qIds = (questions ?? []).map((q) => q.id);
    const latest = new Map<string, { chosen: number[]; is_correct: boolean }>();
    if (qIds.length > 0) {
      const { data: attempts } = await client
        .from('quiz_attempts')
        .select('quiz_question_id, chosen, is_correct, created_at')
        .eq('user_id', userId)
        .in('quiz_question_id', qIds)
        .order('created_at', { ascending: false });
      for (const a of attempts ?? []) {
        if (!latest.has(a.quiz_question_id)) {
          latest.set(a.quiz_question_id, { chosen: a.chosen as number[], is_correct: a.is_correct });
        }
      }
    }

    for (const q of questions ?? []) {
      const att = latest.get(q.id);
      const arr = questionsByLesson.get(q.lesson_id) ?? [];
      arr.push({
        id: q.id,
        prompt: q.prompt,
        choices: q.choices,
        points: q.points ?? 1,
        chosen: att ? att.chosen : null,
        is_correct: att ? att.is_correct : null,
        // Reveal the key only once the user has attempted this question.
        correct: att ? (q.correct as number[]) : null,
        explanation: att ? (q.explanation ?? null) : null,
      });
    }
  }

  // --- Exercises + this user's best submission -----------------------------
  const exerciseByLesson = new Map<string, unknown>();
  if (exLessonIds.length > 0) {
    const { data: exercises } = await client
      .from('exercises')
      .select('id, lesson_id, type, prompt_md, spec, answer_key, max_score')
      .in('lesson_id', exLessonIds);

    const exIds = (exercises ?? []).map((e) => e.id);
    const best = new Map<string, { answer: unknown; score: number; passed: boolean }>();
    if (exIds.length > 0) {
      const { data: subs } = await client
        .from('exercise_subs')
        .select('exercise_id, answer, score, passed')
        .eq('user_id', userId)
        .in('exercise_id', exIds);
      for (const s of subs ?? []) {
        const cur = best.get(s.exercise_id);
        if (!cur || s.score > cur.score) {
          best.set(s.exercise_id, { answer: s.answer, score: s.score, passed: s.passed });
        }
      }
    }

    for (const e of exercises ?? []) {
      const sub = best.get(e.id);
      exerciseByLesson.set(e.lesson_id, {
        id: e.id,
        type: e.type,
        prompt_md: e.prompt_md,
        spec: e.spec,
        max_score: e.max_score ?? 10,
        answer: sub ? sub.answer : null,
        score: sub ? sub.score : null,
        passed: sub ? sub.passed : null,
        // Reveal the key only once the user has submitted this exercise.
        answer_key: sub ? e.answer_key : null,
      });
    }
  }

  const out = lessonRows.map((l) =>
    l.kind === 'quiz'
      ? { lesson_id: l.id, kind: 'quiz', questions: questionsByLesson.get(l.id) ?? [] }
      : { lesson_id: l.id, kind: 'exercise', exercise: exerciseByLesson.get(l.id) ?? null },
  );

  return new Response(JSON.stringify({ lessons: out }), {
    status: 200,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
});
