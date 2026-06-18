// English UI strings — flat dotted keys, {var} interpolation supported.
// Keep technical terms (token, prompt, context window, RAG, etc.) as-is.

const en = {
  // ---------------------------------------------------------------------------
  // Nav / common
  // ---------------------------------------------------------------------------
  'nav.brand': 'TrainingKit',
  'nav.leaderboard': 'Leaderboard',
  'nav.admin': 'Admin',
  'nav.signOut': 'Sign out',
  'nav.dashboard': 'Dashboard',
  'nav.backToDashboard': 'Back to dashboard',

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
  'dashboard.summary': '10 modules · two levels each · complete L1 to unlock L2',
  'dashboard.badges': 'Your badges',
  'dashboard.loadingProgress': 'Loading progress…',

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
  'lesson.saveError': 'Could not save progress',
  'lesson.goToLesson': 'Go to lesson: {title}',

  // Lesson kind labels
  'lesson.kind.concept': 'Concept',
  'lesson.kind.example': 'Worked example',
  'lesson.kind.quiz': 'Quiz',
  'lesson.kind.exercise': 'Exercise',

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

  // ---------------------------------------------------------------------------
  // Leaderboard
  // ---------------------------------------------------------------------------
  'leaderboard.title': 'Leaderboard',
  'leaderboard.col.rank': 'Rank',
  'leaderboard.col.name': 'Name',
  'leaderboard.col.score': 'Score',
  'leaderboard.col.badges': 'Badges',
  'leaderboard.col.modules': 'Modules passed',
  'leaderboard.you': '(you)',
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
  'admin.users.col.name': 'Name',
  'admin.users.col.role': 'Role',
  'admin.users.col.modules': 'Modules passed',
  'admin.users.col.score': 'Total score',
  'admin.users.col.badges': 'Badges',
  'admin.users.empty': 'No users found.',
  'admin.tab.progress': 'Progress',
  'admin.progress.col.user': 'User',
  'admin.progress.col.role': 'Role',
  'admin.progress.col.exam': 'Exam',
  'admin.progress.col.devScore': 'Development score',
  'admin.progress.legend': 'Development score = 80% content mastery + 20% best exam score',
  'admin.progress.empty': 'No progress data yet.',
  'admin.progress.examNever': '—',

  // ---------------------------------------------------------------------------
  // Dashboard module titles and descriptions
  // Keyed as module.<code>.title / .desc
  // ---------------------------------------------------------------------------
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

  // Section headings
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

  // Vibe Coding module
  'module.vibe_coding.title': 'Vibe Coding',
  'module.vibe_coding.desc': 'Building software with AI pair-programmers: prompting IDEs, reviewing AI output, and staying in control.',

  // ---------------------------------------------------------------------------
  // Exam
  // ---------------------------------------------------------------------------
  'exam.pageTitle': 'Case-Based Assessment',
  'exam.instructions': 'Work through the case-based questions and submit to see your score. You need 75 or above to pass.',
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
  'exam.cta.blurb': 'Measure what you’ve learned with case-based scenario questions, and earn your certificate.',
  'exam.cta.button': 'Start',
} as const;

export type TranslationKey = keyof typeof en;
export default en;
