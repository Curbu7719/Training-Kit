// Create demo users with varied, REAL progress (via the live grading functions)
// so the admin Progress screen and the leaderboard have data to show.
// Idempotent-ish: find-or-create by email; re-running just re-submits.
// Usage: SUPABASE_URL=.. SUPABASE_ANON_KEY=.. SUPABASE_SERVICE_ROLE_KEY=.. node scripts/seed-demo-users.mjs
import { createClient } from '@supabase/supabase-js';

const url = process.env.SUPABASE_URL, anon = process.env.SUPABASE_ANON_KEY, service = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !anon || !service) { console.error('Need SUPABASE_URL/ANON/SERVICE_ROLE_KEY'); process.exit(1); }
const admin = createClient(url, service, { auth: { persistSession: false } });
const pub = createClient(url, anon, { auth: { persistSession: false } });
const PASSWORD = 'Demo-1234!';

const SDLC = ['llm_foundations','tokens','context_management','prompting','guardrails','security_privacy','tool_use_agents','rag','evaluation','cost_latency','ai_architecture'];
const STRAT = ['ai_fit_buildbuy','ai_risk_governance','ai_value_scaling'];
const VIBE = ['vibe_coding'];
const ALL_L2 = ['context_management','guardrails','security_privacy','tool_use_agents','rag','evaluation','cost_latency','ai_architecture', ...STRAT, ...VIBE];

// personas: l1 (modules to pass at L1), l2 (also pass at L2), exam correctCount (or null)
const PERSONAS = [
  { name: 'Elif Demir',    email: 'elif@demo.local',    l1: [...SDLC, ...STRAT, ...VIBE], l2: ALL_L2,                                 exam: 19 },
  { name: 'Ayşe Yılmaz',   email: 'ayse@demo.local',    l1: [...SDLC.slice(0,8), ...STRAT], l2: ['context_management','guardrails','ai_fit_buildbuy'], exam: 17 },
  { name: 'Mehmet Kaya',   email: 'mehmet@demo.local',  l1: SDLC.slice(0,5),             l2: [],                                     exam: 16 },
  { name: 'Zeynep Şahin',  email: 'zeynep@demo.local',  l1: [...STRAT,'llm_foundations','tokens'], l2: STRAT,                       exam: 14 },
  { name: 'Can Öztürk',    email: 'can@demo.local',     l1: [...VIBE,'llm_foundations','tokens'],  l2: VIBE,                        exam: null },
];

async function findOrCreate(email) {
  for (let page = 1; page <= 20; page++) {
    const { data } = await admin.auth.admin.listUsers({ page, perPage: 1000 });
    const hit = data.users.find((u) => u.email?.toLowerCase() === email);
    if (hit) return hit.id;
    if (data.users.length < 1000) break;
  }
  const { data, error } = await admin.auth.admin.createUser({ email, password: PASSWORD, email_confirm: true });
  if (error) throw error;
  return data.user.id;
}

async function authedFor(email) {
  const { data: s, error } = await pub.auth.signInWithPassword({ email, password: PASSWORD });
  if (error) throw error;
  return createClient(url, anon, { auth: { persistSession: false }, global: { headers: { Authorization: `Bearer ${s.session.access_token}` } } });
}

const exAns = (e) => e.type === 'order' ? { order: e.answer_key.order }
  : e.type === 'mcq' ? { selected: e.answer_key.correct }
  : e.type === 'scenario' ? { decision: e.answer_key.decision, reason: e.answer_key.reason }
  : e.type === 'match' ? { pairs: e.answer_key.pairs }
  : { values: e.answer_key.accept.map((s) => s[0]) };

async function completeLevel(authed, moduleId, level) {
  const { data: lessons } = await admin.from('lessons').select('id').eq('module_id', moduleId).eq('level', level).eq('lang', 'en');
  const ids = (lessons ?? []).map((l) => l.id);
  if (!ids.length) return;
  const { data: qs } = await admin.from('quiz_questions').select('id, correct').in('lesson_id', ids);
  const { data: exs } = await admin.from('exercises').select('id, type, answer_key').in('lesson_id', ids);
  for (const q of qs ?? []) await authed.functions.invoke('quiz-submit', { body: { quiz_question_id: q.id, chosen: q.correct } });
  for (const e of exs ?? []) await authed.functions.invoke('exercise-submit', { body: { exercise_id: e.id, answer: exAns(e) } });
}

async function takeExam(authed, correctCount) {
  const { data: qs } = await admin.from('exam_questions').select('id, correct').eq('lang', 'en').order('sort_order');
  const answers = Object.fromEntries(qs.map((q, i) => [q.id, i < correctCount ? q.correct : (q.correct + 1) % 4]));
  const { data } = await authed.functions.invoke('exam-submit', { body: { answers, lang: 'en' } });
  return data?.score;
}

const codeToId = new Map();
{
  const { data: mods } = await admin.from('modules').select('id, code');
  for (const m of mods) codeToId.set(m.code, m.id);
}

for (const p of PERSONAS) {
  const uid = await findOrCreate(p.email);
  await admin.from('profiles').update({ display_name: p.name, role: 'user' }).eq('id', uid);
  const authed = await authedFor(p.email);
  const l1set = new Set([...p.l1, ...p.l2]);
  for (const code of l1set) await completeLevel(authed, codeToId.get(code), 'L1');
  for (const code of p.l2) await completeLevel(authed, codeToId.get(code), 'L2');
  let examScore = null;
  if (p.exam != null) examScore = await takeExam(authed, p.exam);
  console.log(`✓ ${p.name} <${p.email}> — L1:${l1set.size} L2:${p.l2.length}${p.exam != null ? ` exam:${examScore}` : ''}`);
}
console.log(`\nDone. All demo users have password: ${PASSWORD}`);
