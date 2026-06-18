// exam-submit — grade the standalone SDLC exam.
//
// Request (JSON body):
//   { answers: { [questionId: string]: number }, lang?: 'en' | 'tr' }
//     answers maps each exam_question id to the chosen choice index.
//
// Response:
//   {
//     score: number,        // 0-100
//     correctCount: number,
//     total: number,
//     passed: boolean,      // score >= 75
//     results: [{ question_id, is_correct, correct, explanation }],
//     newBadge: string | null   // 'cert_sdlc_exam' if just awarded
//   }
//
// The answer key (correct) and explanation live only on the server; they are
// returned per question AFTER grading. Pass at >= 75 awards the exam badge.

import { corsHeaders, handleCors } from '../_shared/cors.ts';
import { createServiceClient, verifyJwt } from '../_shared/supabase-client.ts';

const PASS_SCORE = 75;

Deno.serve(async (req: Request) => {
  const preflight = handleCors(req);
  if (preflight) return preflight;

  let userId: string;
  try {
    userId = await verifyJwt(req);
  } catch (errResponse) {
    return errResponse as Response;
  }

  let body: { answers?: Record<string, number>; lang?: string } = {};
  try {
    const text = await req.text();
    if (text) body = JSON.parse(text);
  } catch {
    return json({ error: 'Invalid JSON body' }, 400);
  }

  const answers = body.answers ?? {};
  const lang = body.lang === 'tr' ? 'tr' : 'en';
  const client = createServiceClient();

  // Load the exam questions for this language (service role can read the key).
  const { data: questions, error } = await client
    .from('exam_questions')
    .select('id, correct, explanation')
    .eq('lang', lang);

  if (error) return json({ error: error.message }, 500);
  if (!questions || questions.length === 0) return json({ error: 'No exam questions found' }, 404);

  const total = questions.length;
  let correctCount = 0;
  const results = questions.map((q) => {
    const chosen = answers[q.id];
    const is_correct = chosen === q.correct;
    if (is_correct) correctCount += 1;
    return { question_id: q.id, is_correct, correct: q.correct, explanation: q.explanation };
  });

  const score = Math.round((correctCount / total) * 100);
  const passed = score >= PASS_SCORE;

  // Record the attempt.
  await client.from('exam_results').insert({ user_id: userId, lang, score, passed });

  // Award the exam badge on first pass.
  let newBadge: string | null = null;
  if (passed) {
    const { data: badge } = await client.from('badges').select('id').eq('code', 'cert_sdlc_exam').single();
    if (badge) {
      const { error: insErr } = await client
        .from('user_badges')
        .insert({ user_id: userId, badge_id: badge.id });
      if (!insErr) newBadge = 'cert_sdlc_exam'; // null on conflict (already had it)
    }
  }

  return json({ score, correctCount, total, passed, results, newBadge }, 200);
});

function json(payload: unknown, status: number): Response {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}
