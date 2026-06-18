# Migration Planning — Worked Example

## Moving from an old data store to a new one

A team needs to replace an ageing data store with a newer one. The old store holds millions of live records and serves real users every second. They cannot afford downtime or lost data, so they plan an incremental migration instead of a big-bang switch.

**Step 1 — Find the seams.** Reads and writes to the old store are scattered across many files. Before migrating anything, they route all of that access through a single thin data-access layer. Now there is *one* place that talks to the store.

**Step 2 — Stand up the new store alongside the old.** It is deployed but serves no users yet; the old store remains the source of truth.

**Step 3 — Dual-write.** They change the data-access layer to write to *both* stores on every update, while still reading only from the old one. New data now exists in both places, and the new store starts catching up.

**Step 4 — Backfill.** A background job copies historical records from the old store into the new one, until the two hold the same data.

**Step 5 — Shadow-read and compare.** Reads still return the old store's answer, but the layer also queries the new store and logs any differences. The team fixes mismatches until results agree.

**Step 6 — Cut over incrementally.** They switch reads to the new store for a small percentage of traffic, watch error rates, then ramp up. If anything looks wrong, they flip reads back — the old store is still live, so rollback is instant.

**Step 7 — Decommission.** Only once the new store has served full traffic reliably do they stop dual-writing and retire the old store — the last and only irreversible step.

No single moment could take the whole system down, and a fast path back existed at every step.
