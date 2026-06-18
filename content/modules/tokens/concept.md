# What Is a Token?

When you send text to a large language model (LLM), the model does not read whole
words the way people do. It first breaks the text into small pieces called **tokens**.
A token is usually a **sub-word unit** — sometimes a whole short word, sometimes part
of a longer word, sometimes just punctuation or a space. This step is called
**tokenization**. The model only ever "sees" tokens, never raw letters or words.

**An analogy.** Think of tokens like LEGO bricks. A short word such as "cat" might be
a single brick. A longer or rarer word such as "tokenization" might be built from
several bricks ("token", "iz", "ation"). The model assembles and predicts text one
brick at a time, not one word at a time.

**Why "1 word ≠ 1 token."** Common words often map to one token, but many words split
into two or more. Spaces, punctuation, and capitalization also affect the split. A rough
rule of thumb for English is that **100 tokens ≈ 75 words**, but this varies by language
and content (code and numbers tokenize differently than prose).

**Why tokens matter.** Two of the most practical limits in any LLM are measured in
tokens, not words:

- **Context limits.** A model can only consider a fixed number of tokens at once (its
  *context window*). Input plus output must fit inside it.
- **Pricing.** LLM usage is almost always billed **per token**, and providers usually
  charge **separately for input tokens and output tokens** (output is often more
  expensive). Estimating token counts is therefore how you estimate both feasibility
  and cost.

**Estimating and counting.** You can estimate with the rough 100-tokens-to-75-words
ratio, but for anything cost-sensitive you should count exactly using a tokenizer tool
or library for your chosen model, since each model family tokenizes a little differently.

## How each role uses this

- **Developer/Engineer:** Counts tokens programmatically before each call to stay under
  context limits and to chunk long inputs; trims prompts to control latency and cost.
- **Business Analyst:** Translates "tokens per request" into expected monthly spend so
  feature ideas can be compared on a realistic cost basis.
- **PM/Product Owner:** Sets scope and pricing expectations knowing context windows and
  per-token billing cap how much text a feature can process per request.
- **QA & Architect:** Tests behaviour near context-limit boundaries (truncation,
  dropped context) and designs systems that budget input vs. output tokens deliberately.
