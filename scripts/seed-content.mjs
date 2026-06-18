// Seed curriculum content from content/modules/<code>/ into the database.
// Maps markdown + JSON files to lessons / quiz_questions / exercises rows.
// See docs/CONTENT-GUIDE.md for the authoring contract.
//
// Bilingual: English content lives at the module root and seeds as lang='en';
// Turkish content under a `tr/` subfolder seeds as lang='tr'. Levels: root = L1,
// `l2/` = L2 (and `tr/l2/` = Turkish L2).
//
// Usage:  SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... node scripts/seed-content.mjs
//
// Idempotent per (module, level, lang): deletes those lessons first (cascading
// their quiz_questions/exercises) then re-inserts.

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
async function insertLesson(moduleId, kind, level, lang, title, bodyMd, sortOrder) {
  const { data, error } = await supabase
    .from('lessons')
    .insert({ module_id: moduleId, kind, level, lang, title, body_md: bodyMd, sort_order: sortOrder })
    .select('id')
    .single();
  if (error) throw new Error(`lesson(${kind},${level},${lang}): ${error.message}`);
  return data.id;
}

/** Seed one (level, lang) of a module from baseDir. */
async function seedLevel(moduleId, code, level, lang, baseDir) {
  // Wipe existing lessons for this module+level+lang (cascades quiz/exercise rows).
  const { error: delErr } = await supabase
    .from('lessons')
    .delete()
    .eq('module_id', moduleId)
    .eq('level', level)
    .eq('lang', lang);
  if (delErr) throw new Error(`delete lessons(${code},${level},${lang}): ${delErr.message}`);

  let sort = 0;

  const conceptPath = join(baseDir, 'concept.md');
  if (existsSync(conceptPath)) {
    let body = read(conceptPath);
    const hintsPath = join(baseDir, 'hints.md');
    if (existsSync(hintsPath)) body += `\n\n---\n\n${read(hintsPath)}`;
    await insertLesson(moduleId, 'concept', level, lang, 'Concept', body, (sort += 1));
  }

  const examplePath = join(baseDir, 'example.md');
  if (existsSync(examplePath)) {
    await insertLesson(moduleId, 'example', level, lang, 'Worked Example', read(examplePath), (sort += 1));
  }

  const quizPath = join(baseDir, 'quiz.json');
  if (existsSync(quizPath)) {
    const lessonId = await insertLesson(moduleId, 'quiz', level, lang, 'Quiz', null, (sort += 1));
    const questions = readJson(quizPath).map((q) => ({
      lesson_id: lessonId,
      prompt: q.prompt,
      choices: q.choices,
      correct: q.correct,
      points: q.points ?? 1,
    }));
    if (questions.length) {
      const { error } = await supabase.from('quiz_questions').insert(questions);
      if (error) throw new Error(`quiz_questions(${code},${level},${lang}): ${error.message}`);
    }
  }

  const exPath = join(baseDir, 'exercise.json');
  if (existsSync(exPath)) {
    const lessonId = await insertLesson(moduleId, 'exercise', level, lang, 'Exercise', null, (sort += 1));
    const ex = readJson(exPath);
    const { error } = await supabase.from('exercises').insert({
      lesson_id: lessonId,
      type: ex.type,
      prompt_md: ex.prompt_md,
      spec: ex.spec,
      answer_key: ex.answer_key,
      max_score: ex.max_score ?? 10,
    });
    if (error) throw new Error(`exercises(${code},${level},${lang}): ${error.message}`);
  }

  return sort;
}

/** Seed both levels for one language rooted at langDir (which holds L1 files + optional l2/). */
async function seedLang(moduleId, code, lang, langDir) {
  if (!existsSync(join(langDir, 'concept.md'))) return null;
  const l1 = await seedLevel(moduleId, code, 'L1', lang, langDir);
  let l2 = 0;
  const l2Dir = join(langDir, 'l2');
  if (existsSync(l2Dir)) l2 = await seedLevel(moduleId, code, 'L2', lang, l2Dir);
  return { l1, l2 };
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
    const en = await seedLang(mod.id, code, 'en', dir);            // English = module root
    const tr = await seedLang(mod.id, code, 'tr', join(dir, 'tr')); // Turkish = tr/ subfolder

    const parts = [];
    if (en) parts.push(`en L1:${en.l1}${en.l2 ? ` L2:${en.l2}` : ''}`);
    if (tr) parts.push(`tr L1:${tr.l1}${tr.l2 ? ` L2:${tr.l2}` : ''}`);
    console.log(`✓ ${code} — ${parts.join(' | ') || 'no content'}`);
    seeded += 1;
  }
  console.log(`\nSeeded ${seeded}/${codes.length} module folder(s).`);
}

main().catch((e) => {
  console.error('SEED FAILED:', e.message);
  process.exit(1);
});
