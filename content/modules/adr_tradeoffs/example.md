# Architecture Decisions & Trade-Offs — Worked Example

## Choosing how to store uploaded files

A team is building an app where users upload documents. They need to decide where the files live. Instead of arguing in chat and forgetting the outcome, they write a short ADR.

**Context.** Files range from a few kilobytes to ~50 MB. The app already runs on a relational database. Uploads are frequent; downloads are occasional. The team is small and wants low operational burden.

**Options considered.**

- *Store files as binary blobs inside the database.* Simple — one system to back up, transactional with the rest of the data. But large blobs bloat the database, slow backups, and make scaling storage expensive.
- *Store files in a dedicated object storage service; keep only a reference (URL/key) in the database.* Storage scales cheaply and independently; the database stays small. But it adds a second system to manage, and a file and its database row can drift out of sync if cleanup fails.
- *Store files on the application server's local disk.* Cheapest to start. But files vanish if the server is replaced, and it breaks the moment they run more than one server.

**Decision.** Use object storage, with a reference stored in the database.

**Consequences.** They gain cheap, independent scaling and small, fast database backups. They give up transactional simplicity: deleting a record and its file are now two steps, so they add a periodic job to remove orphaned files. Local-disk simplicity is off the table, which is fine because they plan to run multiple servers.

Six months later a new engineer asks, "Why aren't files in the database?" The ADR answers in thirty seconds — no meeting required.
