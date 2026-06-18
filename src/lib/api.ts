import { supabase } from '@/lib/supabase';

// ---------------------------------------------------------------------------
// Response types returned by the grading edge functions.
// ---------------------------------------------------------------------------

export interface QuizSubmitResponse {
  is_correct: boolean;
  correct: number[];
  points: number;
}

export interface ExerciseSubmitResponse {
  score: number;
  max_score: number;
  passed: boolean;
}

export interface ProgressEntry {
  module_id: string;
  level: 'L1' | 'L2';
  status: 'locked' | 'in_progress' | 'passed';
  score: number;
}

export interface ProgressResponse {
  progress: ProgressEntry[];
  newBadges: string[];
}

// ---------------------------------------------------------------------------
// Per-type answer shapes sent to exercise-submit.
// ---------------------------------------------------------------------------

export type McqAnswer = { selected: number[] };
export type OrderAnswer = { order: number[] };
export type MatchAnswer = { pairs: [number, number][] };
export type FillAnswer = { values: string[] };
export type ScenarioAnswer = { decision: number; reason: number };

export type ExerciseAnswer =
  | McqAnswer
  | OrderAnswer
  | MatchAnswer
  | FillAnswer
  | ScenarioAnswer;

// ---------------------------------------------------------------------------
// Typed wrappers around supabase.functions.invoke
// ---------------------------------------------------------------------------

/** Submit a quiz question answer and receive immediate grading feedback. */
export async function submitQuiz(
  quiz_question_id: string,
  chosen: number[]
): Promise<QuizSubmitResponse> {
  const { data, error } = await supabase.functions.invoke<QuizSubmitResponse>(
    'quiz-submit',
    { body: { quiz_question_id, chosen } }
  );
  if (error) throw error;
  if (!data) throw new Error('quiz-submit returned no data');
  return data;
}

/** Submit an exercise answer and receive a score. */
export async function submitExercise(
  exercise_id: string,
  answer: ExerciseAnswer
): Promise<ExerciseSubmitResponse> {
  const { data, error } = await supabase.functions.invoke<ExerciseSubmitResponse>(
    'exercise-submit',
    { body: { exercise_id, answer } }
  );
  if (error) throw error;
  if (!data) throw new Error('exercise-submit returned no data');
  return data;
}

// ---------------------------------------------------------------------------
// Exam
// ---------------------------------------------------------------------------

export interface ExamResult {
  question_id: string;
  is_correct: boolean;
  /** Index (0-3) of the correct choice. */
  correct: number;
  /** Motivating explanation text. */
  explanation: string;
}

export interface ExamSubmitResponse {
  score: number;
  correctCount: number;
  total: number;
  passed: boolean;
  results: ExamResult[];
  newBadge: string | null;
}

/** Submit all exam answers; returns grading results. */
export async function submitExam(
  answers: Record<string, number>,
  lang: 'en' | 'tr'
): Promise<ExamSubmitResponse> {
  const { data, error } = await supabase.functions.invoke<ExamSubmitResponse>(
    'exam-submit',
    { body: { answers, lang } }
  );
  if (error) throw error;
  if (!data) throw new Error('exam-submit returned no data');
  return data;
}

/** Refresh progress state after completing a lesson; returns newly-earned badges. */
export async function refreshProgress(
  module_id?: string,
  level?: 'L1' | 'L2',
  lang?: 'en' | 'tr'
): Promise<ProgressResponse> {
  const body: Record<string, string> = {};
  if (module_id !== undefined) body['module_id'] = module_id;
  if (level !== undefined) body['level'] = level;
  if (lang !== undefined) body['lang'] = lang;

  const { data, error } = await supabase.functions.invoke<ProgressResponse>(
    'progress',
    { body }
  );
  if (error) throw error;
  if (!data) throw new Error('progress returned no data');
  return data;
}
