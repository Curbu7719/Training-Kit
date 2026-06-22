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
  'governance',
  'developer',
  'designer',
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
    core: [m('using_ai_safely'), m('llm_foundations'), m('ai_delivery_portfolio', 'L2'), m('ai_value_scaling'), m('ai_fit_buildbuy'), m('ai_risk_governance')],
    recommended: [m('evaluation'), m('ai_operations_sre')],
  },
  project_manager: {
    core: [m('using_ai_safely'), m('llm_foundations'), m('ai_delivery_portfolio'), m('ai_value_scaling'), m('ai_risk_governance')],
    recommended: [m('tokens'), m('evaluation'), m('vibe_coding'), m('ai_fit_buildbuy')],
  },
  governance: {
    core: [m('using_ai_safely'), m('llm_foundations'), m('ai_risk_governance'), m('security_privacy'), m('guardrails')],
    recommended: [m('evaluation'), m('ai_fit_buildbuy'), m('ai_delivery_portfolio'), m('tool_use_agents')],
  },
  developer: {
    core: [m('using_ai_safely'), m('llm_foundations'), m('tokens'), m('prompting'), m('context_management'), m('tool_use_agents'), m('rag'), m('evaluation'), m('vibe_coding')],
    recommended: [m('guardrails'), m('cost_latency'), m('security_privacy'), m('ai_architecture')],
  },
  designer: {
    core: [m('using_ai_safely'), m('llm_foundations'), m('prompting'), m('context_management'), m('guardrails')],
    recommended: [m('tokens'), m('evaluation'), m('vibe_coding'), m('ai_value_scaling')],
  },
  enterprise_architect: {
    core: [m('using_ai_safely'), m('llm_foundations'), m('ai_architecture'), m('ai_fit_buildbuy'), m('rag'), m('tool_use_agents'), m('security_privacy'), m('cost_latency')],
    recommended: [m('tokens'), m('ai_risk_governance'), m('evaluation'), m('ai_operations_sre'), m('ai_delivery_portfolio'), m('context_management')],
  },
  tester: {
    core: [m('using_ai_safely'), m('llm_foundations'), m('evaluation'), m('guardrails'), m('prompting')],
    recommended: [m('security_privacy'), m('tool_use_agents'), m('context_management'), m('rag')],
  },
  release_manager: {
    core: [m('using_ai_safely'), m('llm_foundations'), m('ai_operations_sre'), m('evaluation'), m('ai_delivery_portfolio')],
    recommended: [m('cost_latency'), m('guardrails'), m('ai_risk_governance')],
  },
  devops_engineer: {
    core: [m('using_ai_safely'), m('llm_foundations'), m('tokens'), m('ai_operations_sre'), m('cost_latency'), m('evaluation')],
    recommended: [m('tool_use_agents'), m('guardrails'), m('security_privacy'), m('ai_architecture')],
  },
  infrastructure_engineer: {
    core: [m('using_ai_safely'), m('llm_foundations'), m('tokens'), m('cost_latency'), m('ai_operations_sre'), m('ai_architecture')],
    recommended: [m('security_privacy'), m('tool_use_agents'), m('rag'), m('context_management')],
  },
  security_engineer: {
    core: [m('using_ai_safely'), m('llm_foundations'), m('security_privacy'), m('guardrails'), m('ai_risk_governance')],
    recommended: [m('tool_use_agents'), m('rag'), m('evaluation'), m('ai_architecture'), m('ai_operations_sre')],
  },
};
