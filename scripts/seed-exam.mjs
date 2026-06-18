// Seed the standalone SDLC exam from content/exam/sdlc-exam.json (en) and
// sdlc-exam.tr.json (tr) into the exam_questions table.
// Usage: SUPABASE_URL=.. SUPABASE_SERVICE_ROLE_KEY=.. node scripts/seed-exam.mjs
import { createClient } from '@supabase/supabase-js';
import { readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const url = process.env.SUPABASE_URL, serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !serviceKey) { console.error('Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.'); process.exit(1); }
const supabase = createClient(url, serviceKey, { auth: { persistSession: false } });

const EXAM_DIR = join(dirname(fileURLToPath(import.meta.url)), '..', 'content', 'exam');
const FILES = [
  { lang: 'en', path: join(EXAM_DIR, 'sdlc-exam.json') },
  { lang: 'tr', path: join(EXAM_DIR, 'sdlc-exam.tr.json') },
];

// Wipe and reload (idempotent).
const { error: delErr } = await supabase.from('exam_questions').delete().neq('id', '00000000-0000-0000-0000-000000000000');
if (delErr) { console.error('delete failed:', delErr.message); process.exit(1); }

for (const { lang, path } of FILES) {
  if (!existsSync(path)) { console.warn(`! ${lang}: ${path} not found, skipped`); continue; }
  const items = JSON.parse(readFileSync(path, 'utf8'));
  const rows = items.map((q, i) => ({
    lang, prompt: q.prompt, choices: q.choices, correct: q.correct,
    explanation: q.explanation ?? null, sort_order: i,
  }));
  const { error } = await supabase.from('exam_questions').insert(rows);
  if (error) { console.error(`${lang} insert failed:`, error.message); process.exit(1); }
  console.log(`✓ ${lang}: ${rows.length} exam questions`);
}
console.log('Exam seeded.');
