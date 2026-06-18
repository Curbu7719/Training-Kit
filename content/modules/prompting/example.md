# Worked Example: Prompting for Unit Tests During the Coding Phase

**The task:** during the coding phase, a developer wants the model to generate unit tests for a `parse_price` function so the new pricing feature ships with coverage.

**First attempt (vague):**

> Write some tests for my parse_price function.

The model has no code, no framework, and no idea what edge cases matter. It invents a plausible-looking function signature, picks a random framework, and writes two happy-path tests against an API that doesn't exist. Useless to the build.

**Engineered prompt.** We add a role, paste the real code in delimiters, state the task precisely, and pin the output format:

> **System:** You are a senior Python engineer. Write tests using `pytest` only. Do not invent functions that aren't shown.
>
> **User:** Generate unit tests for the function between the tags. Cover: a valid price string, an empty string, a negative value, and a non-numeric input.
> Return a single test file, no prose.
> `<code>def parse_price(s): ...</code>`

Now the model returns a clean `test_parse_price.py` with four targeted tests using the project's actual framework.

**Adding a few-shot example** locks in house style. We prepend one existing test so naming and structure match:

> Example of our test style:
> `<test>def test_parse_price_valid(): assert parse_price("9.99") == 9.99</test>`
> Now generate the rest in this style.

**Why each change mattered:**

- The **system message** pinned the framework and forbade invented APIs — so tests actually run.
- **Pasting the code in delimiters** gave the model ground truth instead of a guess, and kept a comment in the code from being read as an instruction.
- **Listing the exact cases** turned "some tests" into the edge cases QA cares about.
- The **few-shot example** matched the team's naming convention, so the diff merges cleanly.

**The lesson:** the model didn't get smarter between attempts — the *brief* did. A structured, code-grounded, example-backed prompt turned a guess into runnable tests the CI pipeline can execute.
