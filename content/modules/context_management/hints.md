# Hints & Alternative Phrasings

## Alternative phrasings of the core idea

- **One sentence:** The context window is a fixed-size budget of tokens — shared by input *and* output — and because each call is stateless, you must re-send whatever you want the model to consider.
- **Another angle:** The model has no memory between calls. "Memory" is just your app pasting the relevant past back into every request, within a hard token ceiling.
- **Strategy framing:** When the window fills up, you don't get more room — you decide what to keep (sliding window), what to compress (summarization), what to fetch on demand (retrieval), and what to save for later (checkpointing).

## Progressive hint stack

- **H1:** Remember the window holds input *and* output together, and the model starts each call fresh. So step one is always: what must be in this request for it to succeed?
- **H2:** Approach a context limit in a sensible sequence — first notice you're near the limit, then decide what is essential vs droppable, then apply a reduction strategy, then re-send the trimmed context and continue. You don't apply a strategy before you've measured the problem.
- **H3:** Match the strategy to the content type. Recent conversational flow → sliding window. Long earlier history you still need the gist of → summarize it. A big reference corpus → retrieve only relevant pieces. Long-running work that must survive a restart → checkpoint a structured summary.

## FAQ

**Q: If I use a model with a bigger context window, is the problem solved?**
A: It's relieved, not solved. A bigger window delays the limit but costs more tokens and money, and very long contexts can dilute the model's focus. You still need a strategy for what to include.

**Q: Does output count against the window too?**
A: Yes. Input and output share the same token budget. A nearly-full input leaves little room for the answer, which can truncate the response.

**Q: Why does the model "forget" things mid-conversation?**
A: Because old content was dropped to fit the window, or wasn't re-sent at all (calls are stateless). The fix is to summarize or retain the essential earlier facts and include them in the new request.
