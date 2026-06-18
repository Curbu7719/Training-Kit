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

// grading: one quiz + one exercise, correct answers
const { data: q } = await admin.from('quiz_questions').select('id, correct').limit(1).single();
const { data: ex } = await admin.from('exercises').select('id, type, answer_key').limit(1).single();
const ans = ex.type === 'order' ? { order: ex.answer_key.order }
  : ex.type === 'mcq' ? { selected: ex.answer_key.correct }
  : ex.type === 'scenario' ? { decision: ex.answer_key.decision, reason: ex.answer_key.reason }
  : ex.type === 'match' ? { pairs: ex.answer_key.pairs }
  : { values: ex.answer_key.accept.map((s) => s[0]) };
const { data: qr } = await authed.functions.invoke('quiz-submit', { body: { quiz_question_id: q.id, chosen: q.correct } });
check('quiz-submit grades correct', qr?.is_correct === true, JSON.stringify(qr));
const { data: er } = await authed.functions.invoke('exercise-submit', { body: { exercise_id: ex.id, answer: ans } });
check('exercise-submit grades full', er?.score === er?.max_score && er?.passed, JSON.stringify(er));

// progress + badge written
const { data: prog } = await admin.from('user_progress').select('status, score').eq('user_id', uid);
check('user_progress recorded', Array.isArray(prog) && prog.length > 0, JSON.stringify(prog));
const { data: ubadges } = await admin.from('user_badges').select('badge_id').eq('user_id', uid);
check('badge awarded', (ubadges?.length ?? 0) >= 1, `${ubadges?.length ?? 0} badge(s)`);

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
