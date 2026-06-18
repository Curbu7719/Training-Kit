// _shared/grading.test.ts
//
// Unit tests for grading.ts — one case per exercise type plus quiz.
// Run with: deno test supabase/functions/_shared/grading.test.ts
//
// No Deno APIs are used in grading.ts itself; these tests are pure assertion checks.

import { assertEquals } from 'https://deno.land/std@0.224.0/assert/mod.ts';
import { gradeQuiz, gradeExercise } from './grading.ts';

// ---------------------------------------------------------------------------
// Quiz
// ---------------------------------------------------------------------------

Deno.test('gradeQuiz — correct single-answer', () => {
  assertEquals(gradeQuiz([1], [1]), true);
});

Deno.test('gradeQuiz — wrong single-answer', () => {
  assertEquals(gradeQuiz([0], [1]), false);
});

Deno.test('gradeQuiz — correct multi-select (order invariant)', () => {
  assertEquals(gradeQuiz([2, 0], [0, 2]), true);
});

Deno.test('gradeQuiz — extra selection makes it wrong', () => {
  assertEquals(gradeQuiz([0, 1, 2], [0, 2]), false);
});

// ---------------------------------------------------------------------------
// MCQ exercise
// ---------------------------------------------------------------------------

Deno.test('gradeExercise mcq — full marks on correct multi-select', () => {
  const result = gradeExercise(
    'mcq',
    { selected: [0, 2] },
    { correct: [0, 2] },
    10,
  );
  assertEquals(result, { score: 10, passed: true });
});

Deno.test('gradeExercise mcq — zero on wrong selection', () => {
  const result = gradeExercise(
    'mcq',
    { selected: [1] },
    { correct: [0, 2] },
    10,
  );
  assertEquals(result, { score: 0, passed: false });
});

// ---------------------------------------------------------------------------
// Order exercise
// ---------------------------------------------------------------------------

Deno.test('gradeExercise order — perfect sequence', () => {
  const result = gradeExercise(
    'order',
    { order: [2, 0, 3, 1] },
    { order: [2, 0, 3, 1] },
    10,
  );
  assertEquals(result, { score: 10, passed: true });
});

Deno.test('gradeExercise order — partial credit (2 of 4 correct)', () => {
  // positions 0 and 1 match; positions 2 and 3 do not
  const result = gradeExercise(
    'order',
    { order: [2, 0, 1, 3] },
    { order: [2, 0, 3, 1] },
    10,
  );
  // 2/4 = 0.5 × 10 = 5, passed = 5 >= 7 → false
  assertEquals(result, { score: 5, passed: false });
});

Deno.test('gradeExercise order — 3 of 4 correct (passes threshold)', () => {
  // positions 0,1,2 match; position 3 wrong
  const result = gradeExercise(
    'order',
    { order: [2, 0, 3, 0] },
    { order: [2, 0, 3, 1] },
    10,
  );
  // 3/4 = 0.75 × 10 = 7.5 → round → 8, passed = 8 >= 7 → true
  assertEquals(result, { score: 8, passed: true });
});

// ---------------------------------------------------------------------------
// Match exercise
// ---------------------------------------------------------------------------

Deno.test('gradeExercise match — all pairs correct', () => {
  const result = gradeExercise(
    'match',
    { pairs: [[0, 0], [1, 1], [2, 2]] },
    { pairs: [[0, 0], [1, 1], [2, 2]] },
    10,
  );
  assertEquals(result, { score: 10, passed: true });
});

Deno.test('gradeExercise match — 1 of 3 pairs correct', () => {
  const result = gradeExercise(
    'match',
    { pairs: [[0, 0], [1, 2], [2, 1]] },
    { pairs: [[0, 0], [1, 1], [2, 2]] },
    10,
  );
  // 1/3 = 0.333 × 10 = 3.33 → round → 3, passed = 3 >= 7 → false
  assertEquals(result, { score: 3, passed: false });
});

// ---------------------------------------------------------------------------
// Fill exercise
// ---------------------------------------------------------------------------

Deno.test('gradeExercise fill — exact keyword match (case insensitive)', () => {
  const result = gradeExercise(
    'fill',
    { values: ['Database'] },
    { accept: [['database', 'baas', 'postgres']] },
    10,
  );
  assertEquals(result, { score: 10, passed: true });
});

Deno.test('gradeExercise fill — accepted synonym', () => {
  const result = gradeExercise(
    'fill',
    { values: ['  postgres  '] },
    { accept: [['database', 'baas', 'postgres']] },
    10,
  );
  assertEquals(result, { score: 10, passed: true });
});

Deno.test('gradeExercise fill — wrong keyword', () => {
  const result = gradeExercise(
    'fill',
    { values: ['client'] },
    { accept: [['database', 'baas', 'postgres']] },
    10,
  );
  assertEquals(result, { score: 0, passed: false });
});

Deno.test('gradeExercise fill — multi-blank partial credit', () => {
  // 1 of 2 blanks correct → 5 (rounds 5), passed = 5 >= 7 → false
  const result = gradeExercise(
    'fill',
    { values: ['database', 'wrong'] },
    { accept: [['database'], ['auth']] },
    10,
  );
  assertEquals(result, { score: 5, passed: false });
});

// ---------------------------------------------------------------------------
// Scenario exercise
// ---------------------------------------------------------------------------

Deno.test('gradeExercise scenario — both correct → full marks', () => {
  const result = gradeExercise(
    'scenario',
    { decision: 1, reason: 0 },
    { decision: 1, reason: 0 },
    10,
  );
  assertEquals(result, { score: 10, passed: true });
});

Deno.test('gradeExercise scenario — decision correct, reason wrong → half marks', () => {
  const result = gradeExercise(
    'scenario',
    { decision: 1, reason: 2 },
    { decision: 1, reason: 0 },
    10,
  );
  // floor(10 / 2) = 5, passed = 5 >= 7 → false
  assertEquals(result, { score: 5, passed: false });
});

Deno.test('gradeExercise scenario — both wrong → zero', () => {
  const result = gradeExercise(
    'scenario',
    { decision: 3, reason: 2 },
    { decision: 1, reason: 0 },
    10,
  );
  assertEquals(result, { score: 0, passed: false });
});

Deno.test('gradeExercise scenario — reason correct but decision wrong → zero', () => {
  // Correct reason without correct decision is not meaningful
  const result = gradeExercise(
    'scenario',
    { decision: 3, reason: 0 },
    { decision: 1, reason: 0 },
    10,
  );
  assertEquals(result, { score: 0, passed: false });
});
