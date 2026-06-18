# Worked Example: A Chatbot That Forgets

A team builds a customer-service chatbot on top of an LLM. Early testing looks great — short conversations work perfectly. Then a tester has a long, 40-message back-and-forth, and partway through the bot "forgets" the customer's name and order number mentioned at the start.

**Why it happened.** The app was re-sending the **entire** conversation on every call, because the model is stateless and only knows what's in the current request. As the chat grew, the accumulated transcript approached the **context window** limit. To fit, the oldest messages — the ones containing the name and order number — were dropped. The model never saw them, so it couldn't use them.

**Fixing it with strategy choices.** The team combines two approaches:

- **Sliding window** for the raw transcript: keep only the last 10 messages verbatim, since recent turns matter most for flow.
- **Summarization** for the rest: whenever messages fall out of the window, fold their key facts ("Customer: Dana Lee, Order #4821, issue: late delivery") into a running summary that is always re-sent at the top of the context.

Now each call contains: a short summary of essentials + the last 10 messages + the new user turn — comfortably within the window, yet preserving the facts that matter.

**A further option.** For policies and product details the bot must reference, the team uses **retrieval** instead of pasting the whole manual: store it externally and pull in only the relevant paragraph per question. This keeps the window lean.

**Takeaway:** running out of context isn't a bug in the model — it's a design constraint. The fix is deciding *what to include* each call and using summarization, a sliding window, and retrieval to keep the essentials present while staying under the limit.
