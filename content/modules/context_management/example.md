# Worked Example: A Multi-File Refactor That Loses the Plan (Maintenance Phase)

**Phase: Maintenance/Refactoring.** A developer asks an AI assistant to rename a core `User` model to `Account` across a legacy service — touching about 30 files. The session starts well: the assistant updates the model, the repository class, and a few callers. Then, twenty files in, it "forgets" an early instruction ("keep the old `user_id` column name for DB compatibility") and starts renaming the column too, breaking migrations.

**Why it happened.** The tool was re-sending the **entire** transcript — every edited file and explanation — on each call, because the model is stateless. As the refactor grew, the accumulated context approached the **context window** limit. To fit, the oldest content — including that compatibility instruction — was dropped. The model never saw it, so it couldn't honor it.

**Fixing it with strategy choices.** The team combines two approaches:

- **Retrieval** for the codebase: instead of pasting all 30 files, fetch only the few files relevant to the current edit. This keeps the window lean across the whole refactor.
- **Summarization with pinned facts** for the plan: maintain a short running summary of the refactor's rules ("rename `User`→`Account`; **keep `user_id` column**; update all callers"), always re-sent at the top so it never scrolls out.

Now each call contains: the pinned refactor rules + a summary of progress so far + only the files being edited now — comfortably within the window.

**A further option.** For long requirements threads in the BA's intake notes, the same idea applies: **summarize** the thread rather than pasting every message.

**Takeaway:** running out of context isn't a model bug — it's a design constraint. The fix is deciding *what to include* each call, using retrieval for code and summarization for the plan, so the essential rules stay present while you stay under the limit.
