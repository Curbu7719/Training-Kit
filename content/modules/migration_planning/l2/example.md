# Migration Planning (L2) — Worked Example

## Renaming a column without breaking anything, using expand–contract

A team needs to rename a database column from `phone` to `contact_number`. Many parts of the app read and write it. A naive rename is a big-bang change: the instant the column name changes, every old running instance of the app breaks, and rolling back means renaming again under pressure. Instead they use **expand–contract**.

**Expand.** They add the new `contact_number` column alongside the existing `phone` column. Nothing reads it yet. The old column is still the source of truth, so all current code keeps working untouched.

**Migrate writes.** They deploy code that writes to *both* columns on every update, keeping them in sync. A one-off backfill job copies existing `phone` values into `contact_number`. Now both columns hold the same data, and any version of the app — old or new — still functions, because `phone` is intact.

**Migrate reads.** Behind a feature flag, they switch reads to `contact_number` for a small slice of traffic. They watch for errors and compare values. When confident, they flip the flag fully. If anything misbehaves, flipping the flag back is instant — `phone` was never abandoned.

**Verify the point of no return.** Before removing anything, they confirm no code path and no deployed instance still references `phone`. This is the irreversible step, so they do it only after extended observation.

**Contract.** They stop writing to `phone` and, finally, drop the column.

At no point did old and new code fail to coexist. Every stage before the final drop was reversible by a flag flip or a deploy rollback — which is exactly what made a scary schema change boring.
