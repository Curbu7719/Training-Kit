import { supabase } from '@/lib/supabase';

// ---------------------------------------------------------------------------
// Response envelope from admin-api / leaderboard edge functions.
// ---------------------------------------------------------------------------

interface OkEnvelope<T> {
  ok: true;
  data: T;
}

interface ErrEnvelope {
  ok: false;
  error: string;
}

type Envelope<T> = OkEnvelope<T> | ErrEnvelope;

async function invokeAdmin<T>(action: string, params?: object): Promise<T> {
  const { data, error } = await supabase.functions.invoke<Envelope<T>>('admin-api', {
    body: { action, ...params },
  });
  if (error) throw error;
  if (!data) throw new Error('admin-api returned no data');
  if (!data.ok) throw new Error(data.error);
  return data.data;
}

// ---------------------------------------------------------------------------
// Module list
// ---------------------------------------------------------------------------

export interface ModuleSummary {
  id: string;
  code: string;
  title: string;
  sort_order: number;
  l1_lessons: number;
  l2_lessons: number;
  quiz_count: number;
  exercise_count: number;
}

export async function listModules(): Promise<ModuleSummary[]> {
  return invokeAdmin<ModuleSummary[]>('list_modules');
}

// ---------------------------------------------------------------------------
// Module full detail (for content editing)
// ---------------------------------------------------------------------------

export interface LessonRow {
  id: string;
  module_id: string;
  kind: 'concept' | 'example' | 'quiz' | 'exercise';
  title: string;
  body_md: string | null;
  sort_order: number;
}

export interface QuizQuestionRow {
  id: string;
  lesson_id: string;
  prompt: string;
  choices: unknown;
  correct: unknown;
  points: number;
}

export interface ExerciseRow {
  id: string;
  lesson_id: string;
  type: 'mcq' | 'order' | 'match' | 'fill' | 'scenario';
  prompt_md: string;
  spec: unknown;
  answer_key: unknown;
  max_score: number;
}

export interface ModuleFull {
  module: ModuleSummary;
  lessons: LessonRow[];
  quiz_questions: QuizQuestionRow[];
  exercises: ExerciseRow[];
}

export async function getModuleFull(code: string): Promise<ModuleFull> {
  return invokeAdmin<ModuleFull>('get_module_full', { code });
}

// ---------------------------------------------------------------------------
// Update actions
// ---------------------------------------------------------------------------

export interface UpdateLessonParams {
  id: string;
  title?: string;
  body_md?: string;
}

export async function updateLesson(params: UpdateLessonParams): Promise<LessonRow> {
  return invokeAdmin<LessonRow>('update_lesson', params);
}

export interface UpdateQuizQuestionParams {
  id: string;
  prompt?: string;
  choices?: unknown;
  correct?: unknown;
  points?: number;
}

export async function updateQuizQuestion(params: UpdateQuizQuestionParams): Promise<QuizQuestionRow> {
  return invokeAdmin<QuizQuestionRow>('update_quiz_question', params);
}

export interface UpdateExerciseParams {
  id: string;
  prompt_md?: string;
  spec?: unknown;
  answer_key?: unknown;
  max_score?: number;
}

export async function updateExercise(params: UpdateExerciseParams): Promise<ExerciseRow> {
  return invokeAdmin<ExerciseRow>('update_exercise', params);
}

// ---------------------------------------------------------------------------
// User list
// ---------------------------------------------------------------------------

export interface UserSummary {
  id: string;
  display_name: string | null;
  role: 'user' | 'admin';
  modules_passed: number;
  total_score: number;
  badge_count: number;
}

export async function listUsers(): Promise<UserSummary[]> {
  return invokeAdmin<UserSummary[]>('list_users');
}

// ---------------------------------------------------------------------------
// Leaderboard (any authed user — separate edge function)
// ---------------------------------------------------------------------------

export interface LeaderboardEntry {
  rank: number;
  name: string;
  total_score: number;
  badges: number;
  modules_passed: number;
}

export async function getLeaderboard(): Promise<LeaderboardEntry[]> {
  const { data, error } = await supabase.functions.invoke<Envelope<LeaderboardEntry[]>>('leaderboard');
  if (error) throw error;
  if (!data) throw new Error('leaderboard returned no data');
  if (!data.ok) throw new Error(data.error);
  return data.data;
}
