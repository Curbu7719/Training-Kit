// Seed curriculum content from content/modules/<code>/ into the database.
// Maps markdown + JSON files to lessons / quiz_questions / exercises rows.
// See docs/CONTENT-GUIDE.md for the authoring contract.
//
// Usage:  SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... node scripts/seed-content.mjs
//
// Idempotent: for each (module, level) it deletes existing lessons first
// (cascading to their quiz_questions/exercises) then re-inserts. On a fresh
// DB this is a no-op delete; re-running after authoring refreshes content.
// NOTE: deleting lessons cascades to any user attempts on them — safe before
// real users exist; for production re-seeds prefer a content-admin upsert path.

import { createClient } from '@supabase/supabase-js';
import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const url = process.env.SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !serviceKey) {
  console.error('Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.');
  process.exit(1);
}

const supabase = createClient(url, serviceKey, { auth: { persistSession: false } });

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const MODULES_DIR = join(ROOT, 'content', 'modules');

const read = (p) => readFileSync(p, 'utf8');
const readJson = (p) => JSON.parse(read(p));

/** Insert one lesson and return its id. */
async function insertLesson(moduleId, kind, level, title, bodyMd, sortOrder) {
  const { data, error } = await supabase
    .from('lessons')
    .insert({ module_id: moduleId, kind, level, title, body_md: bodyMd, sort_order: sortOrder })
    .select('id')
    .single();
  if (error) throw new Error(`lesson(${kind},${level}): ${error.message}`);
  return data.id;
}

/** Seed one level (L1 = module root, L2 = l2/ subfolder) of a module. */
async function seedLevel(moduleId, code, level, baseDir) {
  // Wipe existing lessons for this module+level (cascades to quiz/exercise rows).
  const { error: delErr } = await supabase
    .from('lessons')
    .delete()
    .eq('module_id', moduleId)
    .eq('level', level);
  if (delErr) throw new Error(`delete lessons(${code},${level}): ${delErr.message}`);

  let sort = 0;

  // concept.md (+ hints.md appended)
  const conceptPath = join(baseDir, 'concept.md');
  if (existsSync(conceptPath)) {
    let body = read(conceptPath);
    const hintsPath = join(baseDir, 'hints.md');
    if (existsSync(hintsPath)) body += `\n\n---\n\n${read(hintsPath)}`;
    await insertLesson(moduleId, 'concept', level, 'Concept', body, (sort += 1));
  }

  // example.md
  const examplePath = join(baseDir, 'example.md');
  if (existsSync(examplePath)) {
    await insertLesson(moduleId, 'example', level, 'Worked Example', read(examplePath), (sort += 1));
  }

  // quiz.json -> quiz lesson + quiz_questions
  const quizPath = join(baseDir, 'quiz.json');
  if (existsSync(quizPath)) {
    const lessonId = await insertLesson(moduleId, 'quiz', level, 'Quiz', null, (sort += 1));
    const questions = readJson(quizPath).map((q) => ({
      lesson_id: lessonId,
      prompt: q.prompt,
      choices: q.choices,
      correct: q.correct,
      points: q.points ?? 1,
    }));
    if (questions.length) {
      const { error } = await supabase.from('quiz_questions').insert(questions);
      if (error) throw new Error(`quiz_questions(${code},${level}): ${error.message}`);
    }
  }

  // exercise.json -> exercise lesson + exercises row
  const exPath = join(baseDir, 'exercise.json');
  if (existsSync(exPath)) {
    const lessonId = await insertLesson(moduleId, 'exercise', level, 'Exercise', null, (sort += 1));
    const ex = readJson(exPath);
    const { error } = await supabase.from('exercises').insert({
      lesson_id: lessonId,
      type: ex.type,
      prompt_md: ex.prompt_md,
      spec: ex.spec,
      answer_key: ex.answer_key,
      max_score: ex.max_score ?? 10,
    });
    if (error) throw new Error(`exercises(${code},${level}): ${error.message}`);
  }

  return sort;
}

async function main() {
  if (!existsSync(MODULES_DIR)) {
    console.error(`No content dir at ${MODULES_DIR}`);
    process.exit(1);
  }
  const codes = readdirSync(MODULES_DIR).filter((d) => statSync(join(MODULES_DIR, d)).isDirectory());

  let seeded = 0;
  for (const code of codes) {
    const { data: mod, error } = await supabase.from('modules').select('id').eq('code', code).maybeSingle();
    if (error) throw new Error(`lookup module ${code}: ${error.message}`);
    if (!mod) {
      console.warn(`! skip "${code}" — no matching modules.code row`);
      continue;
    }
    const dir = join(MODULES_DIR, code);
    const l1 = await seedLevel(mod.id, code, 'L1', dir);
    let l2 = 0;
    const l2Dir = join(dir, 'l2');
    if (existsSync(l2Dir)) l2 = await seedLevel(mod.id, code, 'L2', l2Dir);
    console.log(`✓ ${code} — L1: ${l1} lessons${l2 ? `, L2: ${l2} lessons` : ''}`);
    seeded += 1;
  }
  console.log(`\nSeeded ${seeded}/${codes.length} module folder(s).`);
}

main().catch((e) => {
  console.error('SEED FAILED:', e.message);
  process.exit(1);
});
