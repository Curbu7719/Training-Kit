# Hints & Alternative Phrasings

## Alternative phrasings of the core idea

- **One sentence:** The context window is a fixed-size token budget — shared by input *and* output — and because each call is stateless, you must re-send whatever code, spec, or history you want the model to consider.
- **Another angle:** The model has no memory between calls. The "memory" of a multi-file refactor or a long BA interview is just your app pasting the relevant past back into every request, within a hard token ceiling.
- **Strategy framing:** When the window fills up during a refactor or interview, you don't get more room — you decide what to keep (sliding window), what to compress (summarize the thread), what to fetch on demand (retrieve the relevant files), and what to save for later (checkpoint the plan).

## Progressive hint stack

- **H1:** Remember the window holds input *and* output together, and the model starts each call fresh. So step one is always: what must be in this request — which files, which rules — for it to succeed?
- **H2:** Approach a context limit in a sensible sequence — first *detect* you're near the limit, then *decide* what is essential (the refactor rules, the user's goal) versus droppable, then *apply* a reduction strategy, then *re-send* the trimmed context and continue. You don't apply a strategy before you've measured the problem.
- **H3:** Match the strategy to the content type. Recent dialogue flow → sliding window. Long earlier interview history you still need the gist of → summarize it. A big codebase or doc set → retrieve only the relevant files. Long-running refactor that must survive a session restart → checkpoint a structured summary.

## FAQ

**Q: If I use a model with a bigger context window, is the problem solved?**
A: It's relieved, not solved. A bigger window delays the limit but costs more, and very long contexts can dilute the model's focus on the file you actually care about. You still need a strategy for what to include.

**Q: Does the model's output count against the window too?**
A: Yes. Input and output share the same budget. A near-full input (e.g. 30 pasted files) leaves little room for the answer, which can truncate the generated code.

**Q: Why does the assistant "forget" a rule mid-refactor?**
A: Because old content was dropped to fit the window, or wasn't re-sent at all (calls are stateless). The fix is to summarize or pin the essential rules and include them in every new request.
