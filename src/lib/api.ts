import { supabase } from '@/lib/supabase';

// ---------------------------------------------------------------------------
// Response types returned by the grading edge functions.
// ---------------------------------------------------------------------------

export interface QuizSubmitResponse {
  is_correct: boolean;
  correct: number[];
  points: number;
  explanation: string | null;
}

export interface ExerciseSubmitResponse {
  score: number;
  max_score: number;
  passed: boolean;
  /** Per-requirement breakdown — present for prompt_repair exercises only. */
  details?: { id: string; met: boolean }[];
  /** The correct answer (answer_key), returned after grading so the UI can
   *  reveal it when the learner is wrong. Shape varies by exercise type. */
  correct?: {
    correct?: number[];
    decision?: number;
    reason?: number;
    order?: number[];
    pairs?: [number, number][];
    accept?: string[][];
    /** prompt_repair: a model answer that satisfies every requirement. */
    sample?: string;
  };
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
export type PromptRepairAnswer = { text: string };

export type ExerciseAnswer =
  | McqAnswer
  | OrderAnswer
  | MatchAnswer
  | FillAnswer
  | ScenarioAnswer
  | PromptRepairAnswer;

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

// ---------------------------------------------------------------------------
// Completion reflection (mandatory end-of-training writeup) + exam status
// ---------------------------------------------------------------------------

export interface CompletionReflection {
  work_application: string;
  expected_value: string;
}

/** Load the current user's reflection, or null if they haven't written one. */
export async function getMyReflection(): Promise<CompletionReflection | null> {
  const { data, error } = await supabase
    .from('completion_reflections')
    .select('work_application, expected_value')
    .maybeSingle();
  if (error) throw error;
  return data ?? null;
}

/** Insert or update the current user's reflection (one row per user). */
export async function saveReflection(
  user_id: string,
  work_application: string,
  expected_value: string,
  lang: 'en' | 'tr'
): Promise<void> {
  const { error } = await supabase
    .from('completion_reflections')
    .upsert(
      { user_id, work_application, expected_value, lang, updated_at: new Date().toISOString() },
      { onConflict: 'user_id' }
    );
  if (error) throw error;
}

/** True if the current user has at least one passing exam result. */
export async function hasPassedExam(): Promise<boolean> {
  const { data, error } = await supabase
    .from('exam_results')
    .select('id')
    .eq('passed', true)
    .limit(1);
  if (error) throw error;
  return (data?.length ?? 0) > 0;
}

// ---------------------------------------------------------------------------
// Review — a learner revisiting a level they've worked on, with their own
// previous answers shown next to the correct ones.
// ---------------------------------------------------------------------------

export interface ReviewQuizQuestion {
  id: string;
  prompt: string;
  choices: string[];
  points: number;
  /** The user's most recent submission, or null if never attempted. */
  chosen: number[] | null;
  is_correct: boolean | null;
  /** Correct indexes — present only once the user has attempted the question. */
  correct: number[] | null;
  explanation: string | null;
}

export interface ReviewExerciseData {
  id: string;
  type: 'mcq' | 'order' | 'match' | 'fill' | 'scenario' | 'prompt_repair';
  prompt_md: string;
  spec: Record<string, unknown>;
  max_score: number;
  /** The user's best submission answer, or null if never submitted. */
  answer: unknown | null;
  score: number | null;
  passed: boolean | null;
  /** Answer key — present only once the user has submitted the exercise. */
  answer_key: ExerciseSubmitResponse['correct'] | null;
}

export interface ReviewLesson {
  lesson_id: string;
  kind: 'quiz' | 'exercise';
  questions?: ReviewQuizQuestion[];
  exercise?: ReviewExerciseData | null;
}

export interface ReviewResponse {
  lessons: ReviewLesson[];
}

/** Load the user's previous answers + the correct answers for a worked level. */
export async function getReview(
  module_id: string,
  level: 'L1' | 'L2',
  lang: 'en' | 'tr',
): Promise<ReviewResponse> {
  const { data, error } = await supabase.functions.invoke<ReviewResponse>('review', {
    body: { module_id, level, lang },
  });
  if (error) throw error;
  if (!data) throw new Error('review returned no data');
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
