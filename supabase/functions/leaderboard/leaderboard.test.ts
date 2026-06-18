// leaderboard/leaderboard.test.ts
//
// Deno unit tests for the pure helpers shared by leaderboard and admin-api.
//
// Run with:
//   deno test supabase/functions/leaderboard/leaderboard.test.ts
//
// These tests have no I/O — they only exercise deterministic logic.

import { assertEquals } from 'https://deno.land/std@0.224.0/assert/mod.ts';
import { maskEmail } from '../_shared/leaderboard-helpers.ts';
import { validateCorrectIndexes } from '../_shared/admin-helpers.ts';

// ---------------------------------------------------------------------------
// maskEmail
// ---------------------------------------------------------------------------

Deno.test('maskEmail — returns local-part for a plain email', () => {
  assertEquals(maskEmail('jane.doe@example.com'), 'jane.doe');
});

Deno.test('maskEmail — returns local-part for a corporate email', () => {
  assertEquals(maskEmail('alice.smith@corp.internal'), 'alice.smith');
});

Deno.test('maskEmail — passes through a plain display name unchanged', () => {
  assertEquals(maskEmail('Alice'), 'Alice');
});

Deno.test('maskEmail — passes through a display name with spaces unchanged', () => {
  assertEquals(maskEmail('Alice Smith'), 'Alice Smith');
});

Deno.test('maskEmail — returns Anonymous for null', () => {
  assertEquals(maskEmail(null), 'Anonymous');
});

Deno.test('maskEmail — returns Anonymous for undefined', () => {
  assertEquals(maskEmail(undefined), 'Anonymous');
});

Deno.test('maskEmail — returns Anonymous for empty string', () => {
  assertEquals(maskEmail(''), 'Anonymous');
});

Deno.test('maskEmail — does not mask a string with @ but no domain dot (malformed)', () => {
  // "alice@" has no domain — does not match email pattern, returned as-is
  assertEquals(maskEmail('alice@'), 'alice@');
});

Deno.test('maskEmail — does not mask a string with @ but no local-part', () => {
  // "@example.com" — local-part before @ is empty, pattern does not match
  assertEquals(maskEmail('@example.com'), '@example.com');
});

// ---------------------------------------------------------------------------
// validateCorrectIndexes
// ---------------------------------------------------------------------------

Deno.test('validateCorrectIndexes — valid single-choice answer', () => {
  const result = validateCorrectIndexes(['A', 'B', 'C', 'D'], [2]);
  assertEquals(result, null);
});

Deno.test('validateCorrectIndexes — valid multi-choice answer', () => {
  const result = validateCorrectIndexes(['A', 'B', 'C', 'D'], [0, 3]);
  assertEquals(result, null);
});

Deno.test('validateCorrectIndexes — index exactly at last position', () => {
  const result = validateCorrectIndexes(['A', 'B', 'C'], [2]);
  assertEquals(result, null);
});

Deno.test('validateCorrectIndexes — index out of bounds (too high)', () => {
  const result = validateCorrectIndexes(['A', 'B', 'C'], [3]);
  assertEquals(typeof result, 'string');
  assertEquals(result!.includes('out of bounds'), true);
});

Deno.test('validateCorrectIndexes — negative index', () => {
  const result = validateCorrectIndexes(['A', 'B', 'C'], [-1]);
  assertEquals(typeof result, 'string');
  assertEquals(result!.includes('out of bounds'), true);
});

Deno.test('validateCorrectIndexes — non-integer in correct', () => {
  const result = validateCorrectIndexes(['A', 'B', 'C'], [1.5]);
  assertEquals(typeof result, 'string');
  assertEquals(result!.includes('integers'), true);
});

Deno.test('validateCorrectIndexes — string in correct', () => {
  const result = validateCorrectIndexes(['A', 'B', 'C'], ['A']);
  assertEquals(typeof result, 'string');
  assertEquals(result!.includes('integers'), true);
});

Deno.test('validateCorrectIndexes — empty choices array', () => {
  const result = validateCorrectIndexes([], [0]);
  assertEquals(typeof result, 'string');
  assertEquals(result!.includes('choices'), true);
});

Deno.test('validateCorrectIndexes — empty correct array', () => {
  const result = validateCorrectIndexes(['A', 'B'], []);
  assertEquals(typeof result, 'string');
  assertEquals(result!.includes('correct'), true);
});

Deno.test('validateCorrectIndexes — choices is not an array', () => {
  const result = validateCorrectIndexes('ABCD', [0]);
  assertEquals(typeof result, 'string');
  assertEquals(result!.includes('choices'), true);
});

Deno.test('validateCorrectIndexes — correct is not an array', () => {
  const result = validateCorrectIndexes(['A', 'B'], 0);
  assertEquals(typeof result, 'string');
  assertEquals(result!.includes('correct'), true);
});
