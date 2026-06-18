// _shared/supabase-client.ts
//
// Shared Supabase client helpers for TrainingKit edge functions.
//
// Two exports:
//   createServiceClient()  — service-role client (bypasses RLS, reads answer keys).
//                            Use this for all DB reads/writes inside edge functions.
//   verifyJwt(req)         — extracts and verifies the caller's JWT from the
//                            Authorization: Bearer header. Returns the user_id string
//                            on success; throws a 401 Response on failure.
//
// Pattern mirrors BRDWizard ARCHITECTURE.md §6.1.

import { createClient, SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2';

/**
 * Create a service-role Supabase client.
 * The service role bypasses RLS and can read quiz_questions.correct
 * and exercises.answer_key (which are revoked from anon/authenticated).
 */
export function createServiceClient(): SupabaseClient {
  const url = Deno.env.get('SUPABASE_URL');
  const key = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  if (!url || !key) {
    throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY env vars');
  }
  return createClient(url, key, {
    auth: { persistSession: false },
  });
}

/**
 * Verify the caller's JWT from the Authorization: Bearer header.
 *
 * Uses the anon key + Supabase Auth's getUser() to validate the token —
 * getUser() performs server-side JWT verification against the Supabase
 * Auth server, not just local decode, so it cannot be spoofed.
 *
 * @returns the authenticated user_id (UUID string)
 * @throws a Response(401) if the header is missing or the token is invalid
 */
export async function verifyJwt(req: Request): Promise<string> {
  const authHeader = req.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Response(JSON.stringify({ error: 'Missing Authorization header' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const token = authHeader.replace('Bearer ', '');

  const url = Deno.env.get('SUPABASE_URL');
  const anonKey = Deno.env.get('SUPABASE_ANON_KEY');
  if (!url || !anonKey) {
    throw new Error('Missing SUPABASE_URL or SUPABASE_ANON_KEY env vars');
  }

  // Use an anon client scoped to this request's token for user validation.
  const client = createClient(url, anonKey, {
    auth: { persistSession: false },
    global: { headers: { Authorization: authHeader } },
  });

  const { data: { user }, error } = await client.auth.getUser(token);

  if (error || !user) {
    throw new Response(JSON.stringify({ error: 'Invalid or expired token' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return user.id;
}
