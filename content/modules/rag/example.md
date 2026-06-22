# Worked Example: Make the AI Answer From Your Codebase, Not Its Imagination

You ask the assistant "how do we paginate results in our internal API?" and it confidently invents an endpoint that doesn't exist. It never saw your repo — it's answering from memory. **RAG** fixes exactly this, and it's what turns the AI from a plausible liar into a useful teammate on *your* code.

**The problem: the model never read your stuff.** Its training data stopped at a cutoff and never included your wiki, your standards, or last sprint's ADR. *Why does it lie so confidently?* Because it answers from memory and your internal API was never in that memory. So it guesses something plausible-but-wrong.

**The fix: open-book instead of closed-book.** RAG fetches the few most relevant chunks from your own sources at question time and pastes them into the prompt, so the model answers from *those passages*. *Why does this make your day easier?* You stop reading three wiki pages to answer your own question — you ask, and the assistant answers from the real "Backoff and re-queue policy" page, even though your question never used those words.

**Why it finds the right page without matching words.** Each chunk is embedded — turned into a point in meaning-space — so "how do I retry a failed job?" lands near a page about backoff. *Why use AI here?* Keyword search would miss it; meaning-based retrieval surfaces the page a human would have had to know existed.

**The part that earns your trust: citations.** Every chunk traces back to a file or wiki page, so the answer shows *where* it came from. *Why does this matter?* You can open the actual source and verify — you're not taking the AI's word, you're using it to find the right document fast.

**The takeaway:** RAG is the difference between an assistant that guesses about your codebase and one that quotes it. Give it your real sources and it answers from them — grounded, cited, and checkable — instead of inventing an API you'll waste an hour chasing.
