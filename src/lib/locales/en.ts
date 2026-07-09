// English UI strings — flat dotted keys, {var} interpolation supported.
// Keep technical terms (token, prompt, context window, RAG, etc.) as-is.

const en = {
  // ---------------------------------------------------------------------------
  // Nav / common
  // ---------------------------------------------------------------------------
  'nav.brand': 'TARS Training Platform',
  'nav.leaderboard': 'Leaderboard',
  'nav.admin': 'Admin',
  'nav.signOut': 'Sign out',
  'nav.dashboard': 'Dashboard',
  'nav.backToDashboard': 'Back to dashboard',
  'nav.basics': 'AI basics',
  'nav.myPath': 'My path',
  'nav.glossary': 'Glossary',
  'nav.certificate': 'Certificate',
  'nav.group.learn': 'Learn',
  'nav.group.progress': 'Progress',
  'nav.group.admin': 'Admin',

  // ---------------------------------------------------------------------------
  // Language switcher
  // ---------------------------------------------------------------------------
  'lang.en': 'EN',
  'lang.tr': 'TR',

  // ---------------------------------------------------------------------------
  // Login page
  // ---------------------------------------------------------------------------
  'login.tagline': 'AI application architecture — for everyone on the team',
  'login.email': 'Email',
  'login.emailPlaceholder': 'you@example.com',
  'login.password': 'Password',
  'login.passwordPlaceholder': 'At least 8 characters',
  'login.signIn': 'Sign in',
  'login.signUp': 'Create account',
  'login.signingIn': 'Signing in…',
  'login.creatingAccount': 'Creating account…',
  'login.noAccount': 'No account?',
  'login.createOne': 'Create one',
  'login.alreadyHaveAccount': 'Already have an account?',
  'login.fallbackError': 'Something went wrong. Please try again.',

  // ---------------------------------------------------------------------------
  // Dashboard
  // ---------------------------------------------------------------------------
  'dashboard.learningPath': 'Your learning path',
  'dashboard.modulesPassed': '{passed}/{total} modules passed',
  'dashboard.summary': '18 modules · two levels each · complete L1 to unlock L2',
  'dashboard.badges': 'Your badges',
  'dashboard.loadingProgress': 'Loading progress…',
  'dashboard.newToAi': 'New to AI? Read “AI in 5 minutes” first',
  'dashboard.about.title': 'Before you start',
  'dashboard.about.body': 'An AI-in-the-SDLC literacy program for teams adopting AI across the software lifecycle — covering both building AI features and working in an AI-driven SDLC. It builds shared understanding, not hands-on lab skills. Take the modules in any order; finish L1 to unlock each L2, then sit the exam to earn your certificate. Times shown per level are rough drafts.',
  'dashboard.minutes': '~{min} min',
  'dashboard.greeting': 'Welcome back, {name}',
  'dashboard.hero.sub': 'Your AI-driven SDLC learning path — tailored to your role.',
  'dashboard.continueLearning': 'Continue learning',
  'dashboard.yourRole': 'Your role',
  'dashboard.stat.complete': 'Complete',
  'dashboard.stat.passed': 'Modules passed',
  'dashboard.stat.deepDives': 'Deep dives',
  'dashboard.stats.title': 'Your stats',
  'dashboard.stat.mandatory': 'Mandatory complete',
  'dashboard.stat.recommended': 'Recommended done',
  'dashboard.stat.exam': 'Exam score',
  'dashboard.stat.quiz': 'Quiz accuracy',
  'dashboard.stat.exercise': 'Exercise score',
  'dashboard.stat.badges': 'Badges earned',
  'dashboard.stat.notTaken': 'Not taken yet',
  'dashboard.stat.attempts': '{n} attempted',
  'dashboard.remaining.title': 'Left to finish',
  'dashboard.remaining.modules': '{n} mandatory modules',
  'dashboard.remaining.exam': 'final exam',
  'dashboard.remaining.reflection': 'completion note',
  'dashboard.remaining.done': 'All requirements met — get your certificate',
  'dashboard.completedOn': 'Completed on {date}',

  // Role-based paths
  'role.panel.title': 'Your role path',
  'role.panel.pick': 'Pick your role to see a suggested path through the modules.',
  'role.panel.placeholder': 'Select a role…',
  'role.panel.core': 'Core (required for your role)',
  'role.panel.recommended': 'Recommended',
  'role.panel.progress': '{done}/{total} core modules complete',
  'role.panel.certified': 'Certified ✓',
  'role.panel.note': 'You can still take any module — this only shapes your suggested path and your role badge.',

  // Learning path screen (shown after role selection)
  'path.title': 'Your learning path',
  'path.intro': 'For your role, every module’s L1 plus your role’s own L2 deep dives are mandatory; the remaining L2 deep dives are recommended. You can still take any module at any level.',
  'path.none': 'No path is configured for your role yet.',
  'path.startLearning': 'Start learning',
  'path.browseAll': 'Browse all modules',
  'path.freeChoice': 'Anyone can take anything.',
  'path.mustSection': 'Mandatory',
  'path.mustHelp': 'Every module’s L1, plus the L2 deep dives your role needs.',
  'path.recommendedSection': 'Recommended',
  'path.recommendedHelp': 'Optional L2 deep dives on the remaining modules.',
  'path.must': 'Must',
  'path.recommended': 'Recommended',

  // Completion certificate (role-based, VF-branded)
  'cert.cta': 'Get your certificate',
  'cert.download': 'Download PDF',
  'cert.eyebrow': 'AI-driven SDLC',
  'cert.title': 'Certificate of Completion',
  'cert.presentedTo': 'This is proudly presented to',
  'cert.body': 'for successfully completing the AI-driven SDLC training program for the role of {role}.',
  'cert.date': 'Date',
  'cert.issuer': 'Issued by',
  'cert.incomplete.title': 'Your certificate isn’t ready yet',
  'cert.incomplete.desc': 'Finish the whole program to unlock your certificate:',
  'cert.req.modules': 'All required modules passed',
  'cert.req.exam': 'SDLC exam passed',
  'cert.req.reflection': 'Completion reflection written',
  'role.required': 'Required',
  'role.portfolio_manager': 'Portfolio Manager',
  'role.project_manager': 'Project Manager',
  'role.governance': 'Governance',
  'role.developer': 'Developer',
  'role.solution_designer': 'Solution Designer',
  'role.enterprise_architect': 'Enterprise Architect',
  'role.tester': 'Tester',
  'role.release_manager': 'Release Manager',
  'role.devops_engineer': 'DevOps Engineer',
  'role.infrastructure_engineer': 'Infrastructure Engineer',
  'role.security_engineer': 'Security Engineer',

  // AI basics + glossary
  'glossary.title': 'Glossary',
  'glossary.subtitle': 'Plain-language definitions for every AI term used in the course.',
  'glossary.search': 'Search terms…',
  'glossary.empty': 'No terms match your search.',
  'intro.cta.glossary': 'Open the glossary',
  'intro.cta.start': 'Go to the modules',

  // Module CTA labels
  'dashboard.cta.review': 'Review',
  'dashboard.cta.continue': 'Continue',
  'dashboard.cta.start': 'Start',

  // Level labels inside module card
  'dashboard.level.foundations': 'Foundations',
  'dashboard.level.deepDive': 'Deep dive',

  // Status labels
  'status.notStarted': 'Not started',
  'status.locked': 'Locked',
  'status.inProgress': 'In progress',
  'status.passed': 'Passed',

  // ---------------------------------------------------------------------------
  // Lesson player
  // ---------------------------------------------------------------------------
  'lesson.level': 'Level {level}',
  'lesson.progress': '{done}/{total} complete',
  'lesson.noLessons': 'No lessons found for this module.',
  'lesson.next': 'Next',
  'lesson.markComplete': 'Mark complete',
  'lesson.allDone': 'All lessons complete!',
  'lesson.allDoneDesc': 'Your progress will be saved and any new badges awarded.',
  'lesson.completeModule': 'Complete module',
  'lesson.saving': 'Saving…',
  'lesson.langSwitch.title': 'Language switched mid-module',
  'lesson.langSwitch.desc': 'This module’s quiz and exercise are per-language, so you’ll complete it in the new language. Modules you’ve already passed are unaffected.',
  'lesson.saveError': 'Could not save progress',
  'lesson.retry': 'Retry',
  'lesson.goToLesson': 'Go to lesson: {title}',
  'lesson.l1Passed.title': 'L1 complete — nice work!',
  'lesson.l1Passed.desc': 'You’ve unlocked the L2 deep dive for this module. Keep the momentum going.',
  'lesson.continueL2': 'Continue to L2 — Deep dive',
  'lesson.modulePassed.title': 'Module complete!',
  'lesson.modulePassed.desc': 'Your progress is saved and any new badges awarded.',
  'lesson.continueNext': 'Continue: {title}',
  'lesson.allCoreDone.title': 'All core modules complete!',
  'lesson.allCoreDone.desc': 'You’ve finished every core module for your role. Next up: the exam.',
  'lesson.notPassed.title': 'Almost there',
  'lesson.notPassed.desc': 'You scored below 70% for this level. Revisit the quiz or exercise and retry to pass.',

  // Review mode (revisiting a passed level)
  'review.reviewing': 'Reviewing your answers',
  'review.switchLevel': 'Switch level',
  'review.correct': 'Correct',
  'review.incorrect': 'Incorrect',
  'review.notAttempted': 'Not answered',
  'review.yourAnswer': 'Your answer',
  'review.correctAnswer': 'Correct answer',
  'review.yourScore': 'Your score: {score}/{max}',
  'review.requirements': 'Requirements',

  // Lesson kind labels
  'lesson.kind.concept': 'Concept',
  'lesson.kind.example': 'Worked example',
  'lesson.kind.quiz': 'Quiz',
  'lesson.kind.exercise': 'Exercise',
  'lesson.kind.demo': 'Demo',

  // Model-comparison demo
  'demo.pickPrompt': 'Pick a prompt',
  'demo.prompt': 'Prompt',
  'demo.promptLabel': 'The prompt',
  'demo.note': 'What differs:',

  // ---------------------------------------------------------------------------
  // Badge shelf
  // ---------------------------------------------------------------------------
  'badge.noBadges': 'No badges yet. Complete modules to earn them!',
  'badge.earned': 'Earned: {date}',

  // Toast (badge earned)
  'toast.newBadge.title': 'New badge earned!',

  // ---------------------------------------------------------------------------
  // Hint panel
  // ---------------------------------------------------------------------------
  'hint.toggle': 'Need another explanation?',
  'hint.phrasings': 'Alternative phrasings',
  'hint.hints': 'Hints',
  'hint.faq': 'FAQ',
  'hint.hintLabel': 'Hint {n}',
  'hint.showFirst': 'Show first hint',
  'hint.showNext': 'Show next hint',
  'hint.available': '{n} hint available. Reveal them one at a time.',
  'hint.availablePlural': '{n} hints available. Reveal them one at a time.',
  'hint.allRevealed': 'All hints revealed.',
  'hint.version': 'Version {n}',

  // ---------------------------------------------------------------------------
  // Quiz
  // ---------------------------------------------------------------------------
  'quiz.questionOf': 'Question {n} of {total}',
  'quiz.answerChoices': 'Answer choices',
  'quiz.submit': 'Submit answer',
  'quiz.checking': 'Checking…',
  'quiz.next': 'Next question',
  'quiz.finish': 'Finish quiz',
  'quiz.correct': 'Correct! +{points} point',
  'quiz.correctPlural': 'Correct! +{points} points',
  'quiz.incorrectSingle': 'Incorrect — correct answer is highlighted above',
  'quiz.incorrectPlural': 'Incorrect — correct answers are highlighted above',
  'quiz.submissionFailed': 'Submission failed.',
  'quiz.why': 'Why:',
  'quiz.complete.title': 'Quiz complete!',
  'quiz.complete.score': '{correct}/{total} correct — {score}/{max} points ({pct}%)',

  // ---------------------------------------------------------------------------
  // Exercises (shared)
  // ---------------------------------------------------------------------------
  'exercise.submit': 'Submit',
  'exercise.submitting': 'Submitting…',
  'exercise.continue': 'Continue',
  'exercise.submissionFailed': 'Submission failed.',
  'exercise.result.correct': 'Correct — {score}/{max} points',
  'exercise.result.incorrect': 'Incorrect — {score}/{max} points',
  'exercise.correctAnswer': 'Correct answer:',

  // MCQ exercise
  'exercise.mcq.selectOne': 'Select one option.',
  'exercise.mcq.selectAll': 'Select all that apply.',

  // Order exercise
  'exercise.order.instruction': 'Drag or use the arrows to arrange the items in the correct order.',
  'exercise.order.moveUp': 'Move "{item}" up',
  'exercise.order.moveDown': 'Move "{item}" down',
  'exercise.order.correct': 'Correct order — {score}/{max} points',
  'exercise.order.incorrect': 'Incorrect order — {score}/{max} points',

  // Match exercise
  'exercise.match.instruction': 'For each item on the left, select the matching item on the right.',
  'exercise.match.selectPlaceholder': '— select —',
  'exercise.match.matchFor': 'Match for: {item}',
  'exercise.match.correct': 'All matched correctly — {score}/{max} points',
  'exercise.match.incorrect': 'Some pairs incorrect — {score}/{max} points',

  // Fill exercise
  'exercise.fill.instructionSingle': 'Fill in the blank.',
  'exercise.fill.instructionPlural': 'Fill in all {n} blanks.',
  'exercise.fill.blankLabel': 'Blank {n}',
  'exercise.fill.placeholder': 'Your answer…',
  'exercise.fill.acceptedAnswers': 'Accepted answers:',

  // Scenario exercise
  'exercise.scenario.decision': 'What is the best decision?',
  'exercise.scenario.reason': 'What is the best reason for that decision?',
  'exercise.scenario.bothCorrect': 'Both correct — {score}/{max} points',
  'exercise.scenario.partialCorrect': 'Decision correct, reason incorrect — {score}/{max} points',

  // Prompt-repair exercise (hands-on lab)
  'exercise.promptRepair.instruction': 'Edit the prompt below so it satisfies every requirement, then submit.',
  'exercise.promptRepair.editorLabel': 'Editable prompt',
  'exercise.promptRepair.requirements': 'Your prompt should:',
  'exercise.promptRepair.sample': 'Example answer (one good version)',
  'exercise.promptRepair.result': '{score}/{max} points — {met}/{total} requirements met',

  // ---------------------------------------------------------------------------
  // Leaderboard
  // ---------------------------------------------------------------------------
  'leaderboard.title': 'Leaderboard',
  'leaderboard.col.rank': 'Rank',
  'leaderboard.col.name': 'Name',
  'leaderboard.col.score': 'Score',
  'leaderboard.col.badges': 'Badges',
  'leaderboard.col.modules': 'Modules passed',
  'leaderboard.col.finished': 'Finished',
  'leaderboard.col.role': 'Role',
  'leaderboard.you': '(you)',
  'leaderboard.certificate': 'My certificate',
  'leaderboard.scoreInfo.title': 'How the score works',
  'leaderboard.scoreInfo.body': 'Score = 60% path completion + 25% quiz & exercise mastery + 15% final exam. Finishing your own role path well, with a full exam, scores 100. Every module you complete beyond your path adds bonus points (+4 each), so totals can go above 100. Ties are broken by badges.',
  'leaderboard.empty': 'No leaderboard entries yet.',

  // ---------------------------------------------------------------------------
  // Admin panel
  // ---------------------------------------------------------------------------
  'admin.title': 'Admin panel',
  'admin.badge': 'Admin',
  'admin.tab.content': 'Content',
  'admin.tab.users': 'Users',
  'admin.content.selectModule': 'Select a module to edit its content.',
  'admin.content.noContent': 'No content seeded for this module yet.',
  'admin.lesson.title': 'Lesson',
  'admin.lesson.kind.label': 'Title',
  'admin.lesson.body': 'Body (markdown)',
  'admin.quiz.title': 'Quiz question',
  'admin.quiz.prompt': 'Prompt',
  'admin.quiz.choices': 'Choices (JSON)',
  'admin.quiz.correct': 'Correct (JSON)',
  'admin.quiz.points': 'Points',
  'admin.exercise.title': 'Exercise',
  'admin.exercise.prompt': 'Prompt (markdown)',
  'admin.exercise.spec': 'Spec (JSON)',
  'admin.exercise.answerKey': 'Answer key (JSON)',
  'admin.exercise.maxScore': 'Max score',
  'admin.save': 'Save',
  'admin.saved': 'Saved.',
  'admin.sections.lessons': 'Lessons',
  'admin.sections.quizQuestions': 'Quiz questions',
  'admin.sections.exercises': 'Exercises',
  'admin.users.col.online': 'Status',
  'admin.users.online': 'Online',
  'admin.users.offline': 'Offline',
  'admin.users.onlineCount': '{count} of {total} online now',
  'admin.users.col.name': 'Name',
  'admin.users.col.email': 'Email',
  'admin.users.col.role': 'Role',
  'admin.users.col.modules': 'Modules passed',
  'admin.users.col.score': 'Total score',
  'admin.users.col.badges': 'Badges',
  'admin.users.col.lastLogin': 'Last login',
  'admin.users.never': 'Never',
  'admin.users.empty': 'No users found.',
  'admin.tab.progress': 'Progress',
  'admin.progress.col.user': 'User',
  'admin.progress.col.role': 'Role',
  'admin.progress.col.path': 'Path (done)',
  'admin.progress.col.score': 'Path score',
  'admin.progress.col.quality': 'Quality',
  'admin.progress.col.recommended': 'Recommended',
  'admin.progress.col.total': 'Total',
  'admin.progress.col.exam': 'Exam',
  'admin.progress.col.devScore': 'Development score',
  'admin.progress.legend': 'Path = each user’s mandatory modules (every L1 + their role’s L2 deep dives). Path score = average mastery over ALL of them (not-started = 0, so it blends coverage + quality). Quality = average score over ONLY the units they’ve attempted. Recommended = other L2s done; each adds +5 bonus. Total = path score + bonus.',
  'admin.progress.empty': 'No progress data yet.',
  'admin.progress.examNever': '—',
  'admin.progress.viewDetail': 'View detail',
  'admin.progress.flagTitle': 'Metronomic pacing (CoV {cov}, ~{sec}s between answers) — possible AI/copy. Open the learner to investigate.',

  // Per-user development detail (admin drill-down)
  'admin.detail.back': 'Back to list',
  'admin.detail.modules': 'Module-by-module',
  'admin.detail.col.module': 'Module',
  'admin.detail.exams': 'Exam attempts',
  'admin.detail.activity': 'Activity',
  'admin.detail.firstActivity': 'First activity',
  'admin.detail.lastActivity': 'Last activity',
  'admin.detail.attempts': '{quiz} quiz · {ex} exercise submissions',
  'admin.detail.reflection': 'Completion note',
  'admin.detail.noBadges': 'No badges yet',
  'admin.detail.noExams': 'No exam attempts yet',
  'admin.detail.noActivity': 'No activity recorded yet',
  'admin.detail.failed': 'Failed',
  'admin.detail.lastSeen': 'Last seen',
  'admin.detail.joined': 'Joined',
  'admin.detail.col.time': 'Time',
  'admin.detail.min': '{min}m',
  'admin.detail.fast': 'Fast',
  'admin.detail.fastTitle': 'Suspiciously fast — ~{sec}s median between {n} answers',
  'admin.detail.integrityFast': '⚡ {n} module(s) completed very fast (under 8s between answers).',
  'admin.detail.integrityUniform': '⚡ Metronomic pacing — {n} answers at a near-constant ~{sec}s cadence (variance CoV {cov}). A strong copy-paste / AI-assist signal.',

  // ---------------------------------------------------------------------------
  // Dashboard module titles and descriptions
  // Keyed as module.<code>.title / .desc
  // ---------------------------------------------------------------------------
  'module.using_ai_safely.title': 'Using AI Safely — for Everyone',
  'module.using_ai_safely.desc': 'The shared habits for safely USING the company’s AI tools and agents: treat output as a draft to verify, keep PII and secrets out of prompts, watch for hidden instructions in fetched content, and escalate high-stakes decisions. No coding needed.',
  'module.ai_vs_automation.title': 'AI or Automation? Choosing the Right Tool',
  'module.ai_vs_automation.desc': 'When to reach for AI, when plain deterministic automation wins, and when to combine them. A 3-question rule, worked examples, and the common traps (using a model for exact rules, agent-washing) — plus hybrid design patterns at L2.',
  'module.llm_foundations.title': 'How LLMs Work',
  'module.llm_foundations.desc': 'What an LLM is and does; capabilities and limits; choosing the right model for a task.',

  'module.tokens.title': 'Tokens & Costs',
  'module.tokens.desc': 'What a token is; estimating usage and cost; designing prompts that stay within budget and limits.',

  'module.context_management.title': 'Context Window Management',
  'module.context_management.desc': 'Handling long conversations and documents without losing information or hitting limits.',

  'module.prompting.title': 'Prompting for Real Work',
  'module.prompting.desc': 'Writing system prompts and user turns that produce reliable, structured output.',

  'module.guardrails.title': 'Guardrails & Safety',
  'module.guardrails.desc': 'Identifying prompt injection and jailbreak risks; designing layered defenses.',

  'module.security_privacy.title': 'Security & Privacy',
  'module.security_privacy.desc': 'Handling PII and secrets with AI; preventing prompt and data leaks; surfacing shadow AI.',

  'module.tool_use_agents.title': 'Tool Use & Agents',
  'module.tool_use_agents.desc': 'Function-calling integrations; reasoning about agentic loops and failure modes.',

  'module.rag.title': 'RAG — Retrieval-Augmented Generation',
  'module.rag.desc': 'Building a retrieval pipeline; choosing chunking and embedding strategies.',

  'module.evaluation.title': 'Evaluation & Testing',
  'module.evaluation.desc': 'Defining evals; measuring quality; setting up regression tests for prompts and pipelines.',

  'module.cost_latency.title': 'Cost, Latency & Reliability',
  'module.cost_latency.desc': 'Profiling a pipeline; applying caching, routing, and streaming; setting SLOs.',

  'module.ai_architecture.title': 'AI System Architecture',
  'module.ai_architecture.desc': 'Reading and drawing a full AI system architecture; identifying security and privacy risks.',

  'module.ai_operations_sre.title': 'AI in Operations — SRE & Ops',
  'module.ai_operations_sre.desc': 'Operating AI agents that take actions across your SDLC and ops: bounding blast radius, approval gates, action audit trails, agentic FinOps, and incident response with and about agents.',

  // Section headings
  'section.foundations.title': 'Start here — for everyone',
  'section.sdlc.title': 'AI in the SDLC',
  'section.strategy.title': 'AI Strategy Literacy',
  'section.vibe.title': 'Vibe Coding',
  'section.exam.title': 'Check What You Learned',

  // Strategy strand modules
  'module.ai_fit_buildbuy.title': 'AI Fit & Build vs Buy',
  'module.ai_fit_buildbuy.desc': 'When AI is the right tool; build vs buy vs fine-tune; vendor lock-in and total cost.',
  'module.ai_risk_governance.title': 'AI Risk & Governance',
  'module.ai_risk_governance.desc': 'Data privacy, IP, compliance and responsible AI; the controls and gates that govern AI use.',
  'module.ai_value_scaling.title': 'AI Value & Scaling',
  'module.ai_value_scaling.desc': 'Building the business case and ROI; taking AI from pilot to production at scale.',
  'module.ai_delivery_portfolio.title': 'Delivery & Portfolio in an AI-Driven SDLC',
  'module.ai_delivery_portfolio.desc': 'Managing software delivery and the project portfolio when development itself is AI-driven: estimation, quality gates, real-throughput metrics, and where to invest across teams.',

  // Vibe Coding module
  'module.vibe_coding.title': 'Vibe Coding',
  'module.vibe_coding.desc': 'Building software with AI pair-programmers: prompting IDEs, reviewing AI output, and staying in control.',

  // ---------------------------------------------------------------------------
  // Exam
  // ---------------------------------------------------------------------------
  'exam.pageTitle': 'Case-Based Assessment',
  'exam.instructions': 'A general assessment covering all modules — independent of your role. Work through the case-based questions and submit to see your score. You need 75 or above to pass.',
  'exam.questionLabel': 'Question {n} of {total}',
  'exam.answeredOf': '{answered} of {total} answered',
  'exam.allAnswered': 'All answered — ready to submit',
  'exam.submit': 'Submit answers',
  'exam.submitting': 'Submitting…',
  'exam.submitError': 'Submission failed. Please try again.',
  'exam.loadingQuestions': 'Loading questions…',

  // Results
  'exam.correct': 'Correct',
  'exam.incorrect': 'Incorrect',
  'exam.scoreSummary': '{correct} of {total} correct',
  'exam.retake': 'Try again',
  'exam.badgeEarned': 'Badge earned: {badge}',

  // Motivating headlines
  'exam.headline.perfect': 'Perfect score! Absolutely outstanding!',
  'exam.headline.outstanding': 'Outstanding result!',
  'exam.headline.passed': 'You passed!',
  'exam.headline.close': 'Close — review the explanations and retake!',
  'exam.headline.keepGoing': 'Keep going — every attempt builds knowledge!',

  // Exam CTA on dashboard
  'exam.cta.blurb': 'A general assessment across all modules (independent of your role). Measure what you’ve learned with case-based scenario questions, and earn your certificate.',
  'exam.cta.button': 'Start',

  // ---------------------------------------------------------------------------
  // Completion reflection (mandatory end-of-training writeup)
  // ---------------------------------------------------------------------------
  'reflection.title': 'One last step: put it to work',
  'reflection.intro': 'You finished the training. Before you wrap up, tell us what you can now do in your own day-to-day work with what you learned — and the value it will bring. This is a required step.',
  'reflection.privacy': 'Your answer is private. Only the training admins can see it; other learners cannot.',
  'reflection.q1.label': 'What will you do differently in your own work with what you learned?',
  'reflection.q1.placeholder': 'Be concrete: a task you will hand to AI, a habit you will change, a check you will add. E.g. "I will draft my PR descriptions and edge-case lists with a small model, and review every diff before merging."',
  'reflection.q2.label': 'What value or gain will this bring — to you and to the team?',
  'reflection.q2.placeholder': 'E.g. "A few hours a week back from routine writeups, fewer missed edge cases in review, faster onboarding for new code."',
  'reflection.required': 'Please answer both questions (a sentence or two each) to finish.',
  'reflection.submit': 'Submit & finish',
  'reflection.saving': 'Saving…',
  'reflection.saved': 'Thank you — your reflection is saved.',
  'reflection.savedNote': 'You have completed the training. You can revise your answer any time.',
  'reflection.revise': 'Revise my answer',
  'reflection.editExisting': 'You already submitted this. Editing will update your saved answer.',

  // Exam pass → reflection CTA
  'exam.reflection.title': 'Final step to complete the training',
  'exam.reflection.body': 'You passed. Now write a short, required note on what you will do with this in your own work.',
  'exam.reflection.button': 'Write my completion note',

  // Dashboard reflection banner
  'dashboard.reflection.title': 'Finish your training — one step left',
  'dashboard.reflection.body': 'You passed the exam. Write a short note on what you will do with what you learned.',
  'dashboard.reflection.cta': 'Complete',

  // Admin — reflections tab
  'admin.tab.reflections': 'Reflections',
  'admin.reflections.intro': 'Each learner’s required end-of-training note: what they will do in their own work and the value they expect. Visible to admins only. Ordered by who finished first.',
  'admin.reflections.finished': 'Finished',
  'admin.reflections.empty': 'No reflections submitted yet.',
  'admin.reflections.work': 'What they will do in their work',
  'admin.reflections.value': 'Expected value / gain',

  // Admin — role paths tab
  'admin.tab.rolePaths': 'Role paths',
  'admin.rolePaths.role': 'Role',
  'admin.rolePaths.help': 'Set which modules are required (core) or recommended for each role, and at which level. Changes apply to learners’ dashboards and to leaderboard certification.',
  'admin.rolePaths.counts': '{core} core · {rec} recommended',
  'admin.rolePaths.col.module': 'Module',
  'admin.rolePaths.col.kind': 'In path',
  'admin.rolePaths.col.level': 'Level',
  'admin.rolePaths.kind.off': 'Not in path',
  'admin.rolePaths.kind.core': 'Core (required)',
  'admin.rolePaths.kind.recommended': 'Recommended',

  // ---------------------------------------------------------------------------
  // Welcome / onboarding (CIO message + role picker)
  // ---------------------------------------------------------------------------
  'welcome.cio.eyebrow': 'A message from your CIO',
  'welcome.cio.title': 'We’re learning to build with AI — together',
  'welcome.cio.body1': 'AI is changing how we design, build, and run software. We’re opening our own internal AI Agent platform to every role, and this training is how we get ready to use it well and safely. Let me be clear about what that means for us: it is a tool to take the repetitive weight off your day so you can spend your time on the judgment only you can bring — not a replacement for the people who do that work.',
  'welcome.cio.body2': 'This training is our shared starting point. It is practical and built around your real, day-to-day work: where AI genuinely helps, where it does not, and how to use it safely. There are no wrong questions here — and it is expected that AI sometimes gets things wrong. Checking its work is part of the skill, not a failure.',
  'welcome.cio.body3': 'Please take it seriously and finish it. At the end you will tell us, in your own words, what you will do differently in your work. That is how we turn a course into a real change in how we build.',
  'welcome.cio.signature': '— Your CIO',
  'welcome.role.title': 'Choose your role to start',
  'welcome.role.help': 'We’ll tailor your learning path to your role. Choose carefully — this is set once and can’t be changed afterwards. You can still take any other module any time.',
  'welcome.start': 'Start',
  'welcome.start.hint': 'Pick your role to continue.',
  'welcome.back.title': 'Welcome back',
  'welcome.back.role': 'You’re on the path for:',
  'welcome.continue': 'Continue learning',

  // Completion = all required modules + exam + reflection
  'dashboard.complete.title': 'Training complete 🎉',
  'dashboard.complete.checklist': 'To complete your training:',
  'dashboard.complete.modules': 'Required modules ({done}/{total})',
  'dashboard.complete.exam': 'Pass the exam',
  'dashboard.complete.reflection': 'Write your completion note',
} as const;

export type TranslationKey = keyof typeof en;
export default en;
