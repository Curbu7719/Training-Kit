// _shared/admin-helpers.ts
//
// Pure, I/O-free helpers shared between admin-api and its tests.

/**
 * Validate that every index in `correct` is within bounds of `choices`.
 * `correct` is stored as a jsonb array of integer indexes into `choices`.
 * Returns an error message string, or null if valid.
 */
export function validateCorrectIndexes(
  choices: unknown,
  correct: unknown,
): string | null {
  if (!Array.isArray(choices) || choices.length === 0) {
    return '`choices` must be a non-empty array';
  }
  if (!Array.isArray(correct) || correct.length === 0) {
    return '`correct` must be a non-empty array of integer indexes';
  }
  for (const idx of correct) {
    if (typeof idx !== 'number' || !Number.isInteger(idx)) {
      return `\`correct\` entries must be integers, got: ${JSON.stringify(idx)}`;
    }
    if (idx < 0 || idx >= choices.length) {
      return `\`correct\` index ${idx} is out of bounds for choices length ${choices.length}`;
    }
  }
  return null;
}
