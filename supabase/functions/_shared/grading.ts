// _shared/grading.ts
//
// Pure deterministic graders for TrainingKit exercise and quiz types.
// No Deno APIs, no network calls — fully unit-testable in isolation.
//
// Exercise types and answer shapes follow docs/CONTENT-GUIDE.md exactly.
//
// Exports:
//   gradeQuiz(chosen, correct)       → boolean
//   gradeExercise(type, answer, answerKey, maxScore) → { score, passed }

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type ExerciseType = 'mcq' | 'order' | 'match' | 'fill' | 'scenario' | 'prompt_repair';

/** Client answer shapes (per CONTENT-GUIDE.md) */
export type McqAnswer          = { selected: number[] };
export type OrderAnswer        = { order: number[] };
export type MatchAnswer        = { pairs: [number, number][] };
export type FillAnswer         = { values: string[] };
export type ScenarioAnswer     = { decision: number; reason: number };
export type PromptRepairAnswer = { text: string };

export type ExerciseAnswer =
  | McqAnswer
  | OrderAnswer
  | MatchAnswer
  | FillAnswer
  | ScenarioAnswer
  | PromptRepairAnswer;

/** Answer key shapes (stored in exercises.answer_key, never sent to client) */
export type McqKey      = { correct: number[] };
export type OrderKey    = { order: number[] };
export type MatchKey    = { pairs: [number, number][] };
export type FillKey     = { accept: string[][] };
export type ScenarioKey = { decision: number; reason: number };

/**
 * Prompt-repair key: each check detects one required element in the learner's
 * edited prompt by keyword (anyOf, case-insensitive substring) or a regex.
 * A check passes if anyOf OR regex matches. `pass_ratio` defaults to 0.7.
 * The detection rules live here (hidden); only per-requirement met/not-met is
 * ever returned to the client.
 */
export type PromptRepairCheck = { id: string; anyOf?: string[]; regex?: string };
export type PromptRepairKey   = { checks: PromptRepairCheck[]; pass_ratio?: number };

export type AnswerKey =
  | McqKey
  | OrderKey
  | MatchKey
  | FillKey
  | ScenarioKey
  | PromptRepairKey;

export interface GradeResult {
  score: number;
  passed: boolean;
  /** Optional per-requirement breakdown (prompt_repair) for learner feedback. */
  details?: { id: string; met: boolean }[];
}

// ---------------------------------------------------------------------------
// Quiz grader
// ---------------------------------------------------------------------------

/**
 * Grade a quiz question: compares the learner's chosen indexes to the correct
 * answer set. Order does not matter — set equality only.
 *
 * @param chosen  Array of zero-based choice indexes the learner selected.
 * @param correct Array of zero-based choice indexes that are correct (from DB).
 * @returns true if the sets are equal (all correct, none extra).
 */
export function gradeQuiz(chosen: number[], correct: number[]): boolean {
  if (chosen.length !== correct.length) return false;
  const correctSet = new Set(correct);
  return chosen.every((c) => correctSet.has(c));
}

// ---------------------------------------------------------------------------
// Exercise graders (one per type)
// ---------------------------------------------------------------------------

/**
 * MCQ: set-equality of answer.selected vs answer_key.correct.
 * Full marks or zero — no partial credit for multi-select.
 */
function gradeMcq(answer: McqAnswer, key: McqKey, maxScore: number): GradeResult {
  const correct = gradeQuiz(answer.selected, key.correct);
  const score = correct ? maxScore : 0;
  return { score, passed: score >= Math.ceil(0.7 * maxScore) };
}

/**
 * Order: compare answer.order to answer_key.order position by position.
 * Partial credit = (matching positions) / total × maxScore, rounded.
 *
 * answer.order[i] is the item index the learner placed at position i.
 * answer_key.order[i] is the correct item index at position i.
 */
function gradeOrder(answer: OrderAnswer, key: OrderKey, maxScore: number): GradeResult {
  const total = key.order.length;
  if (total === 0) return { score: 0, passed: false };

  let matches = 0;
  for (let i = 0; i < total; i++) {
    if (answer.order[i] === key.order[i]) matches++;
  }

  const score = Math.round((matches / total) * maxScore);
  return { score, passed: score >= Math.round(0.7 * maxScore) };
}

/**
 * Match: compare answer.pairs to answer_key.pairs.
 * Each pair is [left_index, right_index]. Fraction of correct pairs × maxScore, rounded.
 * Pair order in the submitted array does not matter — we treat them as a set.
 */
function gradeMatch(answer: MatchAnswer, key: MatchKey, maxScore: number): GradeResult {
  const total = key.pairs.length;
  if (total === 0) return { score: 0, passed: false };

  // Build a set of correct pair strings for O(1) lookup
  const correctSet = new Set(key.pairs.map(([l, r]) => `${l}:${r}`));
  const matches = answer.pairs.filter(([l, r]) => correctSet.has(`${l}:${r}`)).length;

  const score = Math.round((matches / total) * maxScore);
  return { score, passed: score >= Math.round(0.7 * maxScore) };
}

/**
 * Fill-in-the-blank: for each blank, lowercase+trim the learner's value and
 * check membership in answer_key.accept[i] (any accepted keyword is correct).
 * Fraction of correct blanks × maxScore, rounded.
 */
function gradeFill(answer: FillAnswer, key: FillKey, maxScore: number): GradeResult {
  const total = key.accept.length;
  if (total === 0) return { score: 0, passed: false };

  let matches = 0;
  for (let i = 0; i < total; i++) {
    const submitted = (answer.values[i] ?? '').toLowerCase().trim();
    const accepted = key.accept[i].map((a) => a.toLowerCase().trim());
    if (accepted.includes(submitted)) matches++;
  }

  const score = Math.round((matches / total) * maxScore);
  return { score, passed: score >= Math.round(0.7 * maxScore) };
}

/**
 * Scenario: two linked MCQs (decision + reason).
 * - Both correct    → full maxScore
 * - Decision only   → maxScore / 2 (rounded down)
 * - Reason only     → 0  (reason without correct decision is not meaningful)
 * - Neither correct → 0
 */
function gradeScenario(answer: ScenarioAnswer, key: ScenarioKey, maxScore: number): GradeResult {
  const decisionCorrect = answer.decision === key.decision;
  const reasonCorrect   = answer.reason   === key.reason;

  let score: number;
  if (decisionCorrect && reasonCorrect) {
    score = maxScore;
  } else if (decisionCorrect) {
    score = Math.floor(maxScore / 2);
  } else {
    score = 0;
  }

  return { score, passed: score >= Math.round(0.7 * maxScore) };
}

/**
 * Prompt-repair: the learner edits a starter prompt to include required
 * elements. Each check is satisfied if any of its keywords appears
 * (case-insensitive substring) or its regex matches. Score is the fraction of
 * checks met × maxScore, rounded. Deterministic — no model is called.
 * Returns per-requirement `details` so the UI can show what's still missing.
 */
function gradePromptRepair(
  answer: PromptRepairAnswer,
  key: PromptRepairKey,
  maxScore: number,
): GradeResult {
  const checks = key.checks ?? [];
  const total = checks.length;
  if (total === 0) return { score: 0, passed: false, details: [] };

  const text = answer.text ?? '';
  const lower = text.toLowerCase();

  const details = checks.map((c) => {
    let met = false;
    if (Array.isArray(c.anyOf) && c.anyOf.some((kw) => lower.includes(kw.toLowerCase()))) {
      met = true;
    }
    if (!met && typeof c.regex === 'string') {
      try {
        met = new RegExp(c.regex, 'i').test(text);
      } catch {
        met = false; // a malformed rule never silently passes
      }
    }
    return { id: c.id, met };
  });

  const metCount = details.filter((d) => d.met).length;
  const score = Math.round((metCount / total) * maxScore);
  const ratio = typeof key.pass_ratio === 'number' ? key.pass_ratio : 0.7;
  return { score, passed: score >= Math.round(ratio * maxScore), details };
}

// ---------------------------------------------------------------------------
// Dispatcher
// ---------------------------------------------------------------------------

/**
 * Grade an exercise by dispatching to the appropriate type-specific grader.
 *
 * @param type      Exercise type from exercises.type column.
 * @param answer    Learner's submitted answer (parsed from exercise_subs.answer).
 * @param answerKey The stored answer key (parsed from exercises.answer_key).
 * @param maxScore  The maximum score for this exercise (exercises.max_score).
 * @returns { score, passed } where passed means score >= 70% of maxScore.
 */
export function gradeExercise(
  type: ExerciseType,
  answer: ExerciseAnswer,
  answerKey: AnswerKey,
  maxScore: number,
): GradeResult {
  switch (type) {
    case 'mcq':
      return gradeMcq(answer as McqAnswer, answerKey as McqKey, maxScore);
    case 'order':
      return gradeOrder(answer as OrderAnswer, answerKey as OrderKey, maxScore);
    case 'match':
      return gradeMatch(answer as MatchAnswer, answerKey as MatchKey, maxScore);
    case 'fill':
      return gradeFill(answer as FillAnswer, answerKey as FillKey, maxScore);
    case 'scenario':
      return gradeScenario(answer as ScenarioAnswer, answerKey as ScenarioKey, maxScore);
    case 'prompt_repair':
      return gradePromptRepair(answer as PromptRepairAnswer, answerKey as PromptRepairKey, maxScore);
    default: {
      // Exhaustiveness guard — TypeScript will warn if a new type is added without a case
      const _exhaustive: never = type;
      throw new Error(`Unknown exercise type: ${_exhaustive}`);
    }
  }
}
