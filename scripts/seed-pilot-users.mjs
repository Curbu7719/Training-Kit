/**
 * Create 5 pilot users with role='user' and zero progress.
 *
 * 'user' role gives full access to all learning content — dashboard, lesson
 * player, leaderboard, quizzes, exercises. Admin panel is excluded (admin
 * role is only for content editors).
 *
 * Idempotent: re-running finds existing accounts and resets the profile.
 * Does NOT touch progress rows — pilots start from a clean slate.
 *
 * Usage:
 *   SUPABASE_SERVICE_ROLE_KEY=<key> node scripts/seed-pilot-users.mjs
 *
 *   The script reads VITE_SUPABASE_URL from .env.local automatically.
 *   Service Role Key: Supabase Dashboard → Project Settings → API → service_role (secret)
 */

import { createClient } from './node_modules/@supabase/supabase-js/dist/index.mjs';
import { readFileSync } from 'fs';
import { resolve } from 'path';

// ---------------------------------------------------------------------------
// Config — read .env.local so we don't need to repeat the URL
// ---------------------------------------------------------------------------

function loadEnvLocal() {
  try {
    const raw = readFileSync(resolve(process.cwd(), '.env.local'), 'utf8');
    const vars = {};
    for (const line of raw.split('\n')) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eq = trimmed.indexOf('=');
      if (eq === -1) continue;
      vars[trimmed.slice(0, eq).trim()] = trimmed.slice(eq + 1).trim();
    }
    return vars;
  } catch {
    return {};
  }
}

const env = loadEnvLocal();
const url     = process.env.SUPABASE_URL ?? env.VITE_SUPABASE_URL;
const service = process.env.SUPABASE_SERVICE_ROLE_KEY ?? env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !service) {
  console.error(
    '\nMissing config.\n\n' +
    '  The script needs SUPABASE_SERVICE_ROLE_KEY.\n' +
    '  Find it: Supabase Dashboard → Project Settings → API → service_role (secret)\n\n' +
    '  Either add it to .env.local:\n' +
    '    SUPABASE_SERVICE_ROLE_KEY=eyJhb...\n\n' +
    '  Or pass it inline:\n' +
    '    SUPABASE_SERVICE_ROLE_KEY=eyJhb... node scripts/seed-pilot-users.mjs\n'
  );
  process.exit(1);
}

const admin = createClient(url, service, { auth: { persistSession: false } });

// ---------------------------------------------------------------------------
// Pilot users
// ---------------------------------------------------------------------------

const PASSWORD = 'Pilot-2024!';

const PILOTS = [
  { email: 'pilot1@trainingkit.local', display_name: 'Pilot 1' },
  { email: 'pilot2@trainingkit.local', display_name: 'Pilot 2' },
  { email: 'pilot3@trainingkit.local', display_name: 'Pilot 3' },
  { email: 'pilot4@trainingkit.local', display_name: 'Pilot 4' },
  { email: 'pilot5@trainingkit.local', display_name: 'Pilot 5' },
];

/** Find existing auth user by email, or create them. Returns auth user id. */
async function findOrCreate(email) {
  for (let page = 1; page <= 20; page++) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage: 1000 });
    if (error) throw error;
    const hit = data.users.find((u) => u.email?.toLowerCase() === email.toLowerCase());
    if (hit) return { id: hit.id, existed: true };
    if (data.users.length < 1000) break;
  }
  const { data, error } = await admin.auth.admin.createUser({
    email,
    password: PASSWORD,
    email_confirm: true,  // skip confirmation email
  });
  if (error) throw error;
  return { id: data.user.id, existed: false };
}

// ---------------------------------------------------------------------------
// Run
// ---------------------------------------------------------------------------

for (const pilot of PILOTS) {
  try {
    const { id, existed } = await findOrCreate(pilot.email);

    const { error: profileErr } = await admin
      .from('profiles')
      .update({ display_name: pilot.display_name, role: 'user' })
      .eq('id', id);

    if (profileErr) throw profileErr;

    console.log(`✓  ${pilot.display_name}  <${pilot.email}>  ${existed ? '(already existed)' : '(created)'}`);
  } catch (err) {
    console.error(`✗  ${pilot.email}: ${err.message}`);
  }
}

console.log(`
Done.
  Emails  : pilot1@trainingkit.local … pilot5@trainingkit.local
  Password: ${PASSWORD}
  Role    : user — full access to all learning content (dashboard, lessons, quiz, leaderboard)
  Progress: zero (clean slate)
`);
