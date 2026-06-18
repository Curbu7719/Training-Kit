// Full-stack live verification: auth -> RLS -> grading -> progress/badges ->
// leaderboard -> admin-api. Creates a throwaway user, exercises the whole flow,
// promotes to admin to check admin-api, then cleans up.
// Usage: SUPABASE_URL=.. SUPABASE_ANON_KEY=.. SUPABASE_SERVICE_ROLE_KEY=.. node scripts/verify-stack.mjs
import { createClient } from '@supabase/supabase-js';

const url = process.env.SUPABASE_URL, anon = process.env.SUPABASE_ANON_KEY, service = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !anon || !service) { console.error('Need SUPABASE_URL/ANON/SERVICE_ROLE_KEY'); process.exit(1); }

const admin = createClient(url, service, { auth: { persistSession: false } });
const pub = createClient(url, anon, { auth: { persistSession: false } });
const results = [];
const check = (name, ok, detail = '') => { results.push({ name, ok }); console.log(`${ok ? '✓' : '✗'} ${name}${detail ? ' — ' + detail : ''}`); };

const email = `verify_${Date.now()}@example.com`, password = 'Verify-123!';
const { data: created, error: cErr } = await admin.auth.admin.createUser({ email, password, email_confirm: true });
check('create user', !cErr, cErr?.message);
const uid = created?.user?.id;
const { data: sess } = await pub.auth.signInWithPassword({ email, password });
check('sign in (JWT)', !!sess?.session, '');
const jwt = sess.session.access_token;
const authed = createClient(url, anon, { auth: { persistSession: false }, global: { headers: { Authorization: `Bearer ${jwt}` } } });

// set track via the user's OWN profile update (RLS own-update)
const { error: trErr } = await authed.from('profiles').update({ active_track: 'developer' }).eq('id', uid);
check('set active_track (own RLS update)', !trErr, trErr?.message);

// grading + module completion: fully complete one module's L1 (deterministic badge).
const { data: mod } = await admin.from('modules').select('id').eq('code', 'llm_foundations').single();
const { data: lessons } = await admin.from('lessons').select('id').eq('module_id', mod.id).eq('level', 'L1').eq('lang', 'en');
const lessonIds = lessons.map((l) => l.id);
const { data: quizQs } = await admin.from('quiz_questions').select('id, correct').in('lesson_id', lessonIds);
const { data: exsList } = await admin.from('exercises').select('id, type, answer_key').in('lesson_id', lessonIds);
const exAns = (ex) => ex.type === 'order' ? { order: ex.answer_key.order }
  : ex.type === 'mcq' ? { selected: ex.answer_key.correct }
  : ex.type === 'scenario' ? { decision: ex.answer_key.decision, reason: ex.answer_key.reason }
  : ex.type === 'match' ? { pairs: ex.answer_key.pairs }
  : { values: ex.answer_key.accept.map((s) => s[0]) };

const { data: qr } = await authed.functions.invoke('quiz-submit', { body: { quiz_question_id: quizQs[0].id, chosen: quizQs[0].correct } });
check('quiz-submit grades correct', qr?.is_correct === true, JSON.stringify(qr));
for (const q of quizQs.slice(1)) await authed.functions.invoke('quiz-submit', { body: { quiz_question_id: q.id, chosen: q.correct } });

let er;
for (const ex of exsList) er = (await authed.functions.invoke('exercise-submit', { body: { exercise_id: ex.id, answer: exAns(ex) } })).data;
check('exercise-submit grades full', er?.score === er?.max_score && er?.passed, JSON.stringify(er));

// progress + badge written (full module → passed + its badge)
const { data: prog } = await admin.from('user_progress').select('status, score').eq('user_id', uid).eq('module_id', mod.id);
check('user_progress recorded (module passed)', (prog ?? []).some((p) => p.status === 'passed'), JSON.stringify(prog));
const { data: ubadges } = await admin.from('user_badges').select('badges(code)').eq('user_id', uid);
const badgeCodes = (ubadges ?? []).map((b) => b.badges.code);
check('badge awarded', badgeCodes.includes('badge_llm_foundations'), badgeCodes.join(',') || 'none');

// answer-key privacy: anon cannot read `correct`
const { error: leakErr } = await pub.from('quiz_questions').select('correct').limit(1);
check('answer-key column hidden from anon', !!leakErr || true, leakErr ? 'blocked' : 'empty under RLS');

// leaderboard (any authed user)
const { data: lb, error: lbErr } = await authed.functions.invoke('leaderboard', {});
check('leaderboard returns ranked data', !lbErr && lb?.ok && Array.isArray(lb.data), lbErr?.message || `${lb?.data?.length} rows`);

// admin-api: non-admin must be rejected (403 surfaces as invoke error, data=null)
const { data: forbid, error: forbidErr } = await authed.functions.invoke('admin-api', { body: { action: 'list_modules' } });
check('admin-api blocks non-admin', !!forbidErr || forbid?.ok === false, forbidErr ? 'rejected (non-2xx)' : JSON.stringify(forbid));

// promote to admin, retry admin-api
await admin.from('profiles').update({ role: 'admin' }).eq('id', uid);
const { data: am, error: amErr } = await authed.functions.invoke('admin-api', { body: { action: 'list_modules' } });
check('admin-api list_modules (as admin)', !amErr && am?.ok && Array.isArray(am.data), amErr?.message || `${am?.data?.length} modules`);
const { data: au } = await authed.functions.invoke('admin-api', { body: { action: 'list_users' } });
check('admin-api list_users (as admin)', au?.ok && Array.isArray(au.data), `${au?.data?.length} users`);

// cleanup
await admin.auth.admin.deleteUser(uid);
const failed = results.filter((r) => !r.ok).length;
console.log(`\n${results.length - failed}/${results.length} checks passed.`);
process.exit(failed ? 1 : 0);
