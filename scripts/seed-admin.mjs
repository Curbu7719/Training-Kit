// Create (or promote) an admin user.
// Usage: ADMIN_EMAIL=.. ADMIN_PASSWORD=.. SUPABASE_URL=.. SUPABASE_SERVICE_ROLE_KEY=.. node scripts/seed-admin.mjs
import { createClient } from '@supabase/supabase-js';

const url = process.env.SUPABASE_URL, service = process.env.SUPABASE_SERVICE_ROLE_KEY;
const email = process.env.ADMIN_EMAIL, password = process.env.ADMIN_PASSWORD;
if (!url || !service || !email) { console.error('Need SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, ADMIN_EMAIL'); process.exit(1); }

const admin = createClient(url, service, { auth: { persistSession: false } });

// Find existing user by email (page through admin list).
async function findUser(targetEmail) {
  for (let page = 1; page <= 20; page++) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage: 1000 });
    if (error) throw error;
    const hit = data.users.find((u) => u.email?.toLowerCase() === targetEmail.toLowerCase());
    if (hit) return hit;
    if (data.users.length < 1000) break;
  }
  return null;
}

let user = await findUser(email);
if (!user) {
  if (!password) { console.error('User does not exist; provide ADMIN_PASSWORD to create it.'); process.exit(1); }
  const { data, error } = await admin.auth.admin.createUser({ email, password, email_confirm: true });
  if (error) throw error;
  user = data.user;
  console.log(`created auth user ${email}`);
} else {
  console.log(`found existing user ${email}`);
  if (password) {
    await admin.auth.admin.updateUserById(user.id, { password, email_confirm: true });
    console.log('reset password + confirmed email');
  }
}

// A profile row is auto-created by trigger on signup; ensure it exists, then set admin.
await admin.from('profiles').upsert({ id: user.id, display_name: email, role: 'admin' }, { onConflict: 'id' });
const { data: prof } = await admin.from('profiles').select('id, display_name, role, active_track').eq('id', user.id).single();
console.log('profile:', JSON.stringify(prof));
console.log(`\n✓ ${email} is now an admin.`);
