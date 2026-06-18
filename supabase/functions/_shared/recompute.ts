// _shared/recompute.ts
//
// Shared progress recompute logic for TrainingKit edge functions.
//
// recomputeModuleProgress(client, userId, moduleId, level):
//   1. Gathers all lessons (and their quiz_questions + exercises) for the
//      module at levels ≤ target (L1 always; L2 cumulative).
//   2. Computes quiz_earned from the user's LATEST attempt per question.
//   3. Computes ex_earned from the user's BEST score per exercise.
//   4. UPSERTs user_progress with status + score.
//   5. Evaluates badge criteria and INSERTs missing user_badges.
//   6. Returns newly-awarded badge codes.
//
// Called after quiz-submit and exercise-submit to keep progress current.
// Also used directly by the /progress edge function.

import { SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2';

export type ModuleLevel = 'L1' | 'L2';

export interface ProgressRow {
  module_id: string;
  level: ModuleLevel;
  status: 'locked' | 'in_progress' | 'passed';
  score: number;
}

const PASS_THRESHOLD = 0.7;

/**
 * Recompute progress for one user × module × level combination.
 * Returns the codes of any badges newly awarded during this recompute.
 */
export async function recomputeModuleProgress(
  client: SupabaseClient,
  userId: string,
  moduleId: string,
  level: ModuleLevel,
): Promise<string[]> {
  // -----------------------------------------------------------------------
  // 1. Resolve lessons for this module at eligible levels.
  //    L1 target → only L1 lessons.
  //    L2 target → L1 + L2 lessons (cumulative depth).
  // -----------------------------------------------------------------------
  const eligibleLevels = level === 'L2' ? ['L1', 'L2'] : ['L1'];

  const { data: lessons, error: lessonsErr } = await client
    .from('lessons')
    .select('id, level')
    .eq('module_id', moduleId)
    .in('level', eligibleLevels);

  if (lessonsErr) throw new Error(`Failed to load lessons: ${lessonsErr.message}`);
  if (!lessons || lessons.length === 0) {
    // No lessons yet — nothing to grade; leave progress as-is.
    return [];
  }

  const lessonIds = lessons.map((l) => l.id);

  // -----------------------------------------------------------------------
  // 2. Quiz points
  // -----------------------------------------------------------------------
  const { data: questions, error: qErr } = await client
    .from('quiz_questions')
    .select('id, points')
    .in('lesson_id', lessonIds);

  if (qErr) throw new Error(`Failed to load quiz_questions: ${qErr.message}`);

  let quizPossible = 0;
  let quizEarned   = 0;

  if (questions && questions.length > 0) {
    quizPossible = questions.reduce((sum, q) => sum + (q.points ?? 1), 0);

    const questionIds = questions.map((q) => q.id);

    // Latest attempt per question: fetch all attempts, then reduce to most-recent
    const { data: attempts, error: attErr } = await client
      .from('quiz_attempts')
      .select('quiz_question_id, is_correct, created_at')
      .eq('user_id', userId)
      .in('quiz_question_id', questionIds)
      .order('created_at', { ascending: false });

    if (attErr) throw new Error(`Failed to load quiz_attempts: ${attErr.message}`);

    // Keep only the latest attempt per question
    const latestByQuestion = new Map<string, boolean>();
    for (const attempt of attempts ?? []) {
      if (!latestByQuestion.has(attempt.quiz_question_id)) {
        latestByQuestion.set(attempt.quiz_question_id, attempt.is_correct);
      }
    }

    // Sum points for correctly-answered questions
    for (const q of questions) {
      if (latestByQuestion.get(q.id) === true) {
        quizEarned += q.points ?? 1;
      }
    }
  }

  // -----------------------------------------------------------------------
  // 3. Exercise points
  // -----------------------------------------------------------------------
  const { data: exercises, error: exListErr } = await client
    .from('exercises')
    .select('id, max_score')
    .in('lesson_id', lessonIds);

  if (exListErr) throw new Error(`Failed to load exercises: ${exListErr.message}`);

  let exPossible = 0;
  let exEarned   = 0;

  if (exercises && exercises.length > 0) {
    exPossible = exercises.reduce((sum, e) => sum + (e.max_score ?? 10), 0);

    const exerciseIds = exercises.map((e) => e.id);

    // Best score per exercise across all submissions
    const { data: subs, error: subsErr } = await client
      .from('exercise_subs')
      .select('exercise_id, score')
      .eq('user_id', userId)
      .in('exercise_id', exerciseIds);

    if (subsErr) throw new Error(`Failed to load exercise_subs: ${subsErr.message}`);

    // Map exercise_id → best score
    const bestByExercise = new Map<string, number>();
    for (const sub of subs ?? []) {
      const current = bestByExercise.get(sub.exercise_id) ?? 0;
      if (sub.score > current) bestByExercise.set(sub.exercise_id, sub.score);
    }

    for (const ex of exercises) {
      exEarned += bestByExercise.get(ex.id) ?? 0;
    }
  }

  // -----------------------------------------------------------------------
  // 4. Compute status + score
  // -----------------------------------------------------------------------
  const total    = quizPossible + exPossible;
  const earned   = quizEarned   + exEarned;
  const ratio    = total > 0 ? earned / total : 0;
  const status   = ratio >= PASS_THRESHOLD ? 'passed' : 'in_progress';
  const score    = Math.round(ratio * 100);

  // -----------------------------------------------------------------------
  // 5. UPSERT user_progress
  // -----------------------------------------------------------------------
  const { error: upsertErr } = await client
    .from('user_progress')
    .upsert(
      { user_id: userId, module_id: moduleId, level, status, score, updated_at: new Date().toISOString() },
      { onConflict: 'user_id,module_id,level' },
    );

  if (upsertErr) throw new Error(`Failed to upsert user_progress: ${upsertErr.message}`);

  // -----------------------------------------------------------------------
  // 6. Badge evaluation
  //    Check all badges whose criteria reference this module or track.
  //    Insert any newly earned ones (on conflict do nothing).
  // -----------------------------------------------------------------------
  const newBadgeCodes: string[] = [];

  // Load all badges and existing user badges
  const { data: allBadges } = await client.from('badges').select('id, code, criteria');
  const { data: existingBadges } = await client
    .from('user_badges')
    .select('badge_id')
    .eq('user_id', userId);

  const alreadyAwarded = new Set((existingBadges ?? []).map((b) => b.badge_id));

  for (const badge of allBadges ?? []) {
    if (alreadyAwarded.has(badge.id)) continue;

    const criteria = badge.criteria as Record<string, string>;
    let earned = false;

    if (criteria.type === 'module_passed') {
      // Check if the specific module is now passed at any required level
      earned = await isModulePassed(client, userId, criteria.module);

    } else if (criteria.type === 'all_modules_level') {
      // Single shared curriculum: every module that HAS lessons at this level
      // must be passed at that level.
      earned = await isAllModulesLevelComplete(client, userId, criteria.level as ModuleLevel);

    } else if (criteria.type === 'all_modules_complete') {
      // Full certificate: all L1 content AND all L2 content passed.
      earned =
        (await isAllModulesLevelComplete(client, userId, 'L1')) &&
        (await isAllModulesLevelComplete(client, userId, 'L2'));
    }

    if (earned) {
      const { error: badgeErr } = await client
        .from('user_badges')
        .insert({ user_id: userId, badge_id: badge.id })
        .select()
        // on conflict (user_id, badge_id) do nothing is handled by upsert with ignoreDuplicates
        ;

      if (!badgeErr) {
        newBadgeCodes.push(badge.code);
        alreadyAwarded.add(badge.id); // prevent double-awarding in same pass
      }
      // If badgeErr is a unique violation, the badge was already awarded — ignore
    }
  }

  return newBadgeCodes;
}

// ---------------------------------------------------------------------------
// Badge criteria helpers
// ---------------------------------------------------------------------------

/**
 * Returns true if the user has passed the named module (by module code)
 * at any level required for their current progress row.
 */
async function isModulePassed(
  client: SupabaseClient,
  userId: string,
  moduleCode: string,
): Promise<boolean> {
  const { data: module } = await client
    .from('modules')
    .select('id')
    .eq('code', moduleCode)
    .single();

  if (!module) return false;

  const { data: progress } = await client
    .from('user_progress')
    .select('status')
    .eq('user_id', userId)
    .eq('module_id', module.id)
    .eq('status', 'passed')
    .limit(1);

  return (progress ?? []).length > 0;
}

/**
 * Returns true if EVERY module that has lessons at the given level has been
 * passed at that level by the user. Track-free (single shared curriculum).
 *
 * Note: only modules that actually have L2 content count toward L2 completion,
 * so L1-only modules don't block the L2 / certificate badges.
 */
async function isAllModulesLevelComplete(
  client: SupabaseClient,
  userId: string,
  level: ModuleLevel,
): Promise<boolean> {
  // Distinct modules that have lessons authored at this level.
  const { data: lessons } = await client
    .from('lessons')
    .select('module_id')
    .eq('level', level);

  const moduleIds = [...new Set((lessons ?? []).map((l) => l.module_id))];
  if (moduleIds.length === 0) return false;

  const { data: passed } = await client
    .from('user_progress')
    .select('module_id')
    .eq('user_id', userId)
    .eq('level', level)
    .eq('status', 'passed')
    .in('module_id', moduleIds);

  const passedSet = new Set((passed ?? []).map((p) => p.module_id));
  return moduleIds.every((id) => passedSet.has(id));
}
