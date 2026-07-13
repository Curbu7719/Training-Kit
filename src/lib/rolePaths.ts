// Role-based learning paths for the 11 SDLC roles.
//
// Each role has a Core set (required to earn the role's "Certified" status) and
// a Recommended set. A module is referenced by its `modules.code` plus the level
// the role needs it at ('L1' is the baseline pass; 'L2' is the deep dive, used
// for a role's own-domain modules). Everyone starts from llm_foundations.
//
// Anyone can still complete any module — this only shapes the suggested path and
// the per-role completion badge. Labels come from i18n (`role.<key>`).

export type Level = 'L1' | 'L2';
export interface RoleModule {
  code: string;
  level: Level;
}
export interface RolePath {
  core: RoleModule[];
  recommended: RoleModule[];
}

export const ROLE_ORDER = [
  'portfolio_manager',
  'project_manager',
  'product_owner',
  'governance',
  'developer',
  'solution_designer',
  'enterprise_architect',
  'tester',
  'release_manager',
  'devops_engineer',
  'infrastructure_engineer',
  'security_engineer',
] as const;

export type RoleKey = (typeof ROLE_ORDER)[number];

const m = (code: string, level: Level = 'L1'): RoleModule => ({ code, level });

export const ROLE_PATHS: Record<RoleKey, RolePath> = {
  portfolio_manager: {
    core: [m('using_ai_safely'), m('llm_foundations'), m('tokens'), m('context_management'), m('prompting'), m('guardrails'), m('security_privacy'), m('tool_use_agents'), m('rag'), m('evaluation'), m('cost_latency'), m('ai_architecture'), m('ai_operations_sre'), m('ai_fit_buildbuy', 'L2'), m('ai_risk_governance', 'L2'), m('ai_value_scaling', 'L2'), m('ai_delivery_portfolio', 'L2'), m('vibe_coding')],
    recommended: [],
  },
  project_manager: {
    core: [m('using_ai_safely'), m('llm_foundations'), m('tokens'), m('context_management'), m('prompting'), m('guardrails'), m('security_privacy'), m('tool_use_agents'), m('rag'), m('evaluation'), m('cost_latency'), m('ai_architecture'), m('ai_operations_sre'), m('ai_fit_buildbuy'), m('ai_risk_governance', 'L2'), m('ai_value_scaling', 'L2'), m('ai_delivery_portfolio', 'L2'), m('vibe_coding')],
    recommended: [],
  },
  // Agile Product Owner — product/value focused. Deep dives on writing strong
  // AI-shaped requirements (prompting), deciding what to build with AI
  // (fit/build-buy), and driving business value & delivery.
  product_owner: {
    core: [m('using_ai_safely'), m('llm_foundations'), m('tokens'), m('context_management'), m('prompting', 'L2'), m('guardrails'), m('security_privacy'), m('tool_use_agents'), m('rag'), m('evaluation'), m('cost_latency'), m('ai_architecture'), m('ai_operations_sre'), m('ai_fit_buildbuy', 'L2'), m('ai_risk_governance'), m('ai_value_scaling', 'L2'), m('ai_delivery_portfolio', 'L2'), m('vibe_coding')],
    recommended: [],
  },
  governance: {
    core: [m('using_ai_safely'), m('llm_foundations'), m('tokens'), m('context_management'), m('prompting'), m('guardrails', 'L2'), m('security_privacy', 'L2'), m('tool_use_agents'), m('rag'), m('evaluation'), m('cost_latency'), m('ai_architecture'), m('ai_operations_sre'), m('ai_fit_buildbuy'), m('ai_risk_governance', 'L2'), m('ai_value_scaling'), m('ai_delivery_portfolio'), m('vibe_coding')],
    recommended: [],
  },
  developer: {
    core: [m('using_ai_safely'), m('llm_foundations'), m('tokens', 'L2'), m('context_management', 'L2'), m('prompting', 'L2'), m('guardrails'), m('security_privacy'), m('tool_use_agents', 'L2'), m('rag', 'L2'), m('evaluation', 'L2'), m('cost_latency'), m('ai_architecture'), m('ai_operations_sre'), m('ai_fit_buildbuy'), m('ai_risk_governance'), m('ai_value_scaling'), m('ai_delivery_portfolio'), m('vibe_coding', 'L2')],
    recommended: [],
  },
  solution_designer: {
    core: [m('using_ai_safely'), m('llm_foundations'), m('tokens'), m('context_management', 'L2'), m('prompting', 'L2'), m('guardrails', 'L2'), m('security_privacy'), m('tool_use_agents'), m('rag'), m('evaluation'), m('cost_latency'), m('ai_architecture'), m('ai_operations_sre'), m('ai_fit_buildbuy'), m('ai_risk_governance'), m('ai_value_scaling'), m('ai_delivery_portfolio'), m('vibe_coding')],
    recommended: [],
  },
  enterprise_architect: {
    core: [m('using_ai_safely'), m('llm_foundations'), m('tokens'), m('context_management'), m('prompting'), m('guardrails'), m('security_privacy', 'L2'), m('tool_use_agents', 'L2'), m('rag', 'L2'), m('evaluation'), m('cost_latency', 'L2'), m('ai_architecture', 'L2'), m('ai_operations_sre'), m('ai_fit_buildbuy', 'L2'), m('ai_risk_governance'), m('ai_value_scaling'), m('ai_delivery_portfolio'), m('vibe_coding')],
    recommended: [],
  },
  tester: {
    core: [m('using_ai_safely'), m('llm_foundations'), m('tokens'), m('context_management'), m('prompting', 'L2'), m('guardrails', 'L2'), m('security_privacy'), m('tool_use_agents'), m('rag'), m('evaluation', 'L2'), m('cost_latency'), m('ai_architecture'), m('ai_operations_sre'), m('ai_fit_buildbuy'), m('ai_risk_governance'), m('ai_value_scaling'), m('ai_delivery_portfolio'), m('vibe_coding')],
    recommended: [],
  },
  release_manager: {
    core: [m('using_ai_safely'), m('llm_foundations'), m('tokens'), m('context_management'), m('prompting'), m('guardrails'), m('security_privacy'), m('tool_use_agents'), m('rag'), m('evaluation', 'L2'), m('cost_latency'), m('ai_architecture'), m('ai_operations_sre', 'L2'), m('ai_fit_buildbuy'), m('ai_risk_governance'), m('ai_value_scaling'), m('ai_delivery_portfolio', 'L2'), m('vibe_coding')],
    recommended: [],
  },
  devops_engineer: {
    core: [m('using_ai_safely'), m('llm_foundations'), m('tokens', 'L2'), m('context_management'), m('prompting'), m('guardrails'), m('security_privacy'), m('tool_use_agents'), m('rag'), m('evaluation', 'L2'), m('cost_latency', 'L2'), m('ai_architecture'), m('ai_operations_sre', 'L2'), m('ai_fit_buildbuy'), m('ai_risk_governance'), m('ai_value_scaling'), m('ai_delivery_portfolio'), m('vibe_coding')],
    recommended: [],
  },
  infrastructure_engineer: {
    core: [m('using_ai_safely'), m('llm_foundations'), m('tokens', 'L2'), m('context_management'), m('prompting'), m('guardrails'), m('security_privacy'), m('tool_use_agents'), m('rag'), m('evaluation'), m('cost_latency', 'L2'), m('ai_architecture', 'L2'), m('ai_operations_sre', 'L2'), m('ai_fit_buildbuy'), m('ai_risk_governance'), m('ai_value_scaling'), m('ai_delivery_portfolio'), m('vibe_coding')],
    recommended: [],
  },
  security_engineer: {
    core: [m('using_ai_safely'), m('llm_foundations'), m('tokens'), m('context_management'), m('prompting'), m('guardrails', 'L2'), m('security_privacy', 'L2'), m('tool_use_agents'), m('rag'), m('evaluation'), m('cost_latency'), m('ai_architecture'), m('ai_operations_sre'), m('ai_fit_buildbuy'), m('ai_risk_governance', 'L2'), m('ai_value_scaling'), m('ai_delivery_portfolio'), m('vibe_coding')],
    recommended: [],
  },
};
