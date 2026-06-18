// _shared/leaderboard-helpers.ts
//
// Pure, I/O-free helpers shared between leaderboard and its tests.

/**
 * Mask a display name that looks like an email address.
 * Returns the local-part (before @) if the value matches a basic email pattern,
 * otherwise returns the value unchanged.
 *
 * Examples:
 *   "jane.doe@example.com" → "jane.doe"
 *   "Alice"                → "Alice"
 *   "alice@"               → "alice@"  (malformed — no domain, left as-is)
 */
export function maskEmail(displayName: string | null | undefined): string {
  if (!displayName) return 'Anonymous';
  // Match a simple email: local-part @ domain.tld (all three segments non-empty, no spaces)
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (emailPattern.test(displayName)) {
    return displayName.split('@')[0];
  }
  return displayName;
}
