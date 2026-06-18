# What Is a Token?

When you send text to a large language model (LLM), the model does not read whole
words the way people do. It first breaks the text into small pieces called **tokens**.
A token is usually a **sub-word unit** — sometimes a whole short word, sometimes part
of a longer word, sometimes just punctuation, indentation, or a symbol. This step is
called **tokenization**. The model only ever "sees" tokens, never raw letters or words.

**An SDLC running example.** Imagine an **AI code-review bot** wired into your pull-request
pipeline. When a developer opens a PR, the bot reads the **diff** plus some surrounding
source, then writes review comments. Every character of that diff — variable names, curly
braces, whitespace, line numbers — becomes tokens going *in*, and every comment the bot
writes is tokens coming *out*. Source code tokenizes "heavier" than prose: punctuation and
indentation that humans skim over each cost tokens, so a 400-line diff can be far more
tokens than a 400-line essay.

**Why "1 word ≠ 1 token."** Common words often map to one token, but many split into two
or more, and code splits even more aggressively. A rough rule of thumb for English prose
is **100 tokens ≈ 75 words**, but this varies by language and content.

**Why tokens matter in the pipeline.** Two practical limits are measured in tokens:

- **Context limits.** A model can only consider a fixed number of tokens at once (its
  *context window*). Input plus output must fit inside it. A giant generated file or a
  noisy log can exceed the window and simply won't fit in one call.
- **Pricing.** LLM usage is almost always billed **per token**, and providers usually
  charge **separately for input and output tokens** (output is often more expensive).
  Estimating token counts is how you forecast the monthly cost of an AI feature.

**Estimating and counting.** Use the rough ratio for a first pass, but for anything
cost-sensitive, count exactly with a tokenizer for your chosen model.

## How each role uses this

- **Developer/Engineer:** Checks token counts before sending a large source file or diff
  to an AI tool, and chunks inputs when a file is too big to fit the context window.
- **Business Analyst:** Estimates the token cost of having AI summarize large requirement
  documents or specs, so the spend per analysis is known up front.
- **PM/Product Owner:** Budgets a proposed AI feature (e.g. an automated reviewer) by
  multiplying tokens per request by request volume and the per-token price.
- **QA & Architect:** Anticipates token limits when feeding long test logs or traces to an
  AI triage tool, and designs the pipeline to chunk or truncate inputs deliberately.
