# Worked Example: Make "Be Careful with AI" an Enforceable Rule

"Be careful what you paste" is advice nobody can follow consistently — and an auditor can't verify it. At depth, your job is to turn that vibe into a system that decides for people. Here's how that actually makes daily AI use easier, not harder.

**Label the data so the rule is automatic.** You tag data public / internal / confidential / regulated, and bind an AI rule to each tier: public snippets → any approved tool; confidential code → zero-retention enterprise tool; regulated (PII/PHI/PCI) → redacted or never sent. *Why does this make your day easier?* Nobody has to *judge* in the moment — the label already decided. "Be careful" became "this tier, this tool."

**Verify the contract, don't trust the marketing.** "Zero-retention" and "no-train" live in the agreement and the API config, not in a vibe. You check residency (where prompts are processed), retention window, whether they enter training, and which sub-processors see them. *Why bother?* The free tier and the enterprise tier of the *same* product can have opposite answers — assuming costs you the audit.

**Close the downstream leaks.** The prompt isn't the only surface: prompts and completions land in **logs** and observability tools too. *The move:* keep AI traffic out of plain logs, or redact it there as well — because a leak in a log is still a leak.

**Why use AI at all under all this?** Because now you can say *yes* to it on confidential work. The classification + verified contract + clean logs are exactly what lets legal and security approve real codebase use instead of banning it into shadow AI.

**The takeaway:** governance isn't the thing that slows AI down — it's the thing that lets you use it on the data that matters. Classify, bind rules to tiers, verify the contract, and seal the log surfaces, and "be careful" becomes a control you can prove.
