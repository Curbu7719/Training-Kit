# What Is a Token?

When you send text to a large language model (LLM), the model does not read whole
words the way people do. First it breaks the text into small pieces called **tokens**.
A token is usually a **sub-word unit** — sometimes a whole short word, sometimes part
of a longer word, sometimes just punctuation, spacing, or a symbol. This step is
called **tokenization**. The model only ever "sees" tokens, never raw letters or words.

**An SDLC running example.** Imagine an **AI code-review bot** wired into your pull-request
pipeline. When a developer opens a PR, the bot reads the **diff** (the lines that changed) plus
some nearby source code, then writes review comments. Every character of that diff — variable
names, curly braces, spacing, line numbers — becomes tokens going *in*. And every comment the bot
writes is tokens coming *out*. Source code turns into more tokens than prose: punctuation and
spacing that people skim over each cost tokens. So a 400-line diff can be far more tokens than a
400-line essay.

**Why "1 word ≠ 1 token."** Common words often map to one token. But many words split into two
or more, and code splits even more. A rough rule of thumb for English prose is
**100 tokens ≈ 75 words**, but this changes with the language and the content.

**Why tokens matter in the pipeline.** Two practical limits are measured in tokens:

- **Context limits.** A model can only look at a fixed number of tokens at once (its
  *context window* — the most text it can hold at one time). Input plus output must fit inside it.
  A giant generated file or a noisy log can go over the window and simply won't fit in one call.
- **Pricing.** LLM use is almost always billed **per token**. Providers usually charge
  **separately for input and output tokens** (output often costs more). Estimating token counts is
  how you forecast the monthly cost of an AI feature.

**Estimating and counting.** Use the rough ratio for a first guess. But for anything that is
cost-sensitive, count exactly with a tokenizer (a tool that splits text into tokens) for your
chosen model.

## How each role uses this

- **Developer:** Checks token counts before sending a large file or diff to an AI tool, and splits inputs that won't fit the context window.
- **Project Manager:** Budgets a proposed AI feature (for example, an automated reviewer) by multiplying tokens per request by request volume and the per-token price.
- **Infrastructure Engineer:** Plans provider quota and the cost limit from the expected token volume, so the feature stays within capacity and budget.
- **Enterprise Architect:** Plans ahead for token limits when long logs or traces are fed to an AI tool, and designs the pipeline to split or cut inputs on purpose.
