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
  /** Login email + activity from auth.users (admin-only). */
  email: string | null;
  last_sign_in_at: string | null;
  /** Presence heartbeat (profiles.last_seen_at) — recent = "online". */
  last_seen_at: string | null;
  created_at: string | null;
  modules_passed: number;
  total_score: number;
  badge_count: number;
}

export async function listUsers(): Promise<UserSummary[]> {
  return invokeAdmin<UserSummary[]>('list_users');
}

// ---------------------------------------------------------------------------
// Progress report
// ---------------------------------------------------------------------------

export interface ProgressUser {
  id: string;
  display_name: string;
  role: 'user' | 'admin';
  learning_role: string | null;
  /** Mandatory path = every module's L1 + the role's L2 deep dives. */
  mandatory: { passed: number; total: number; avgScore: number };
  /** Pure quality: average score over only the mandatory units attempted. */
  quality: number;
  /** Recommended = the other modules' L2; each passed adds bonus points. */
  recommended: { passed: number; total: number };
  bonus: number;        // points from recommended modules passed
  path_score: number;   // 0-100 average mastery over mandatory units
  total_score: number;  // path_score + bonus (sorted desc)
  exam_best: number | null;
}

interface ProgressReport {
  users: ProgressUser[];
}

export async function getProgressReport(): Promise<ProgressReport> {
  return invokeAdmin<ProgressReport>('progress_report');
}

// ---------------------------------------------------------------------------
// User detail — full per-learner development report (admin-only drill-down)
// ---------------------------------------------------------------------------

export interface DetailCell {
  status: 'not_started' | 'locked' | 'in_progress' | 'passed';
  score: number;
}

export interface UserDetailModule {
  code: string;
  title: string;
  sort_order: number;
  l1: DetailCell | null;
  l2: DetailCell | null;
  /** Estimated active minutes spent in this module (capped-gap heuristic). */
  minutes: number;
  /** Number of graded interactions (quiz answers + exercise submissions). */
  events: number;
  /** True when completed implausibly fast (low median time between answers). */
  fast: boolean;
  /** Median seconds between consecutive answers, or null. */
  median_gap_sec: number | null;
}

export interface ExamAttempt {
  score: number;
  passed: boolean;
  lang: 'en' | 'tr';
  created_at: string;
}

export interface UserDetail {
  profile: {
    id: string;
    display_name: string | null;
    role: 'user' | 'admin';
    learning_role: string | null;
    email: string | null;
    last_seen_at: string | null;
    last_sign_in_at: string | null;
    created_at: string | null;
  };
  modules: UserDetailModule[];
  integrity: {
    fast_modules: number;
    uniform_pacing: boolean;
    active_answers: number;
    median_gap_sec: number | null;
    cov: number | null;
    flagged: boolean;
  };
  quiz: { attempted: number; correct: number; accuracy: number | null };
  exercise: { earned: number; possible: number; pct: number | null; attempted: number };
  exams: ExamAttempt[];
  exam_best: number | null;
  badges: { code: string | null; title: string | null; awarded_at: string }[];
  reflection: { work_application: string; expected_value: string; lang: 'en' | 'tr'; updated_at: string } | null;
  activity: { quiz_attempts: number; exercise_subs: number; first_at: string | null; last_at: string | null };
}

export async function getUserDetail(userId: string): Promise<UserDetail> {
  return invokeAdmin<UserDetail>('user_detail', { user_id: userId });
}

// ---------------------------------------------------------------------------
// Completion reflections (mandatory end-of-training writeups — admin-only)
// ---------------------------------------------------------------------------

export interface ReflectionEntry {
  user_id: string;
  display_name: string | null;
  learning_role: string | null;
  work_application: string;
  expected_value: string;
  lang: 'en' | 'tr';
  updated_at: string;
}

export async function listReflections(): Promise<ReflectionEntry[]> {
  return invokeAdmin<ReflectionEntry[]>('list_reflections');
}

// ---------------------------------------------------------------------------
// Role paths (admin-managed: which modules are core/recommended per role)
// ---------------------------------------------------------------------------

export interface RolePathRow {
  role: string;
  module_code: string;
  level: 'L1' | 'L2';
  kind: 'core' | 'recommended';
  sort_order: number;
}

export async function getRolePaths(): Promise<RolePathRow[]> {
  return invokeAdmin<RolePathRow[]>('get_role_paths');
}

export interface RolePathEntry {
  module_code: string;
  level: 'L1' | 'L2';
  kind: 'core' | 'recommended';
  sort_order?: number;
}

export async function updateRolePath(role: string, entries: RolePathEntry[]): Promise<{ role: string; count: number }> {
  return invokeAdmin<{ role: string; count: number }>('update_role_path', { role, entries });
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
  /** The user's chosen SDLC role (ROLE_PATHS key), or null. */
  role?: string | null;
  /** True when all of the role's core modules are passed at the required level. */
  certified?: boolean;
}

export async function getLeaderboard(): Promise<LeaderboardEntry[]> {
  const { data, error } = await supabase.functions.invoke<Envelope<LeaderboardEntry[]>>('leaderboard');
  if (error) throw error;
  if (!data) throw new Error('leaderboard returned no data');
  if (!data.ok) throw new Error(data.error);
  return data.data;
}
