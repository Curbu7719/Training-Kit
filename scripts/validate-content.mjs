// Validate authored curriculum content before seeding.
// Checks file presence, JSON shape, and — critically — answer-key sanity
// (indexes in range, order is a permutation, match pairs valid, etc.).
// Usage: node scripts/validate-content.mjs
import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const MODULES_DIR = join(ROOT, 'content', 'modules');
const EX_TYPES = ['mcq', 'order', 'match', 'fill', 'scenario'];

let errors = 0;
let warns = 0;
const err = (m) => { console.error('  ✗ ' + m); errors++; };
const warn = (m) => { console.warn('  ! ' + m); warns++; };

function parse(path) {
  try { return JSON.parse(readFileSync(path, 'utf8')); }
  catch (e) { err(`${path}: invalid JSON — ${e.message}`); return null; }
}

function validateQuiz(path) {
  const q = parse(path); if (!q) return;
  if (!Array.isArray(q)) return err(`${path}: must be an array`);
  if (q.length < 3) warn(`${path}: only ${q.length} question(s) (guide suggests 3-5)`);
  q.forEach((item, i) => {
    const at = `${path}[${i}]`;
    if (typeof item.prompt !== 'string' || !item.prompt.trim()) err(`${at}: missing prompt`);
    if (!Array.isArray(item.choices) || item.choices.length < 2) return err(`${at}: choices must have >=2`);
    if (!Array.isArray(item.correct) || item.correct.length < 1) return err(`${at}: correct must be non-empty array`);
    for (const c of item.correct) {
      if (!Number.isInteger(c) || c < 0 || c >= item.choices.length) err(`${at}: correct index ${c} out of range`);
    }
    if (new Set(item.correct).size !== item.correct.length) err(`${at}: duplicate correct indexes`);
  });
}

function validateExercise(path) {
  const e = parse(path); if (!e) return;
  const at = path;
  if (!EX_TYPES.includes(e.type)) return err(`${at}: type "${e.type}" not in ${EX_TYPES.join('|')}`);
  if (typeof e.prompt_md !== 'string' || !e.prompt_md.trim()) err(`${at}: missing prompt_md`);
  if (typeof e.max_score !== 'number' || e.max_score <= 0) err(`${at}: max_score must be > 0`);
  const spec = e.spec || {}, key = e.answer_key || {};
  const inRange = (idx, n) => Number.isInteger(idx) && idx >= 0 && idx < n;

  switch (e.type) {
    case 'mcq': {
      const n = (spec.choices || []).length;
      if (n < 2) err(`${at}: spec.choices needs >=2`);
      if (!Array.isArray(key.correct) || key.correct.length < 1) err(`${at}: answer_key.correct non-empty`);
      else key.correct.forEach((c) => { if (!inRange(c, n)) err(`${at}: correct ${c} out of range`); });
      break;
    }
    case 'order': {
      const n = (spec.items || []).length;
      if (n < 2) err(`${at}: spec.items needs >=2`);
      const o = key.order;
      if (!Array.isArray(o) || o.length !== n) err(`${at}: answer_key.order must be length ${n}`);
      else if ([...o].sort((a, b) => a - b).join() !== [...Array(n).keys()].join())
        err(`${at}: answer_key.order must be a permutation of 0..${n - 1}`);
      break;
    }
    case 'match': {
      const L = (spec.left || []).length, R = (spec.right || []).length;
      if (L < 2 || R < 2) err(`${at}: spec.left/right need >=2`);
      if (!Array.isArray(key.pairs) || !key.pairs.length) err(`${at}: answer_key.pairs non-empty`);
      else key.pairs.forEach((p) => {
        if (!Array.isArray(p) || p.length !== 2 || !inRange(p[0], L) || !inRange(p[1], R))
          err(`${at}: pair ${JSON.stringify(p)} out of range`);
      });
      break;
    }
    case 'fill': {
      const blanks = spec.blanks ?? (spec.keywords || []).length;
      if (!blanks) err(`${at}: spec.blanks/keywords missing`);
      if (!Array.isArray(key.accept) || key.accept.length !== blanks)
        err(`${at}: answer_key.accept must have ${blanks} entr(ies)`);
      else key.accept.forEach((set, i) => {
        if (!Array.isArray(set) || !set.length) err(`${at}: accept[${i}] must be non-empty array`);
      });
      break;
    }
    case 'scenario': {
      const d = (spec.decision_choices || []).length, r = (spec.reason_choices || []).length;
      if (d < 2 || r < 2) err(`${at}: decision_choices/reason_choices need >=2`);
      if (!inRange(key.decision, d)) err(`${at}: answer_key.decision out of range`);
      if (!inRange(key.reason, r)) err(`${at}: answer_key.reason out of range`);
      break;
    }
  }
}

function validateLevel(dir, label) {
  for (const f of ['concept.md', 'example.md', 'hints.md', 'quiz.json', 'exercise.json']) {
    if (!existsSync(join(dir, f))) warn(`${label}: missing ${f}`);
  }
  if (existsSync(join(dir, 'quiz.json'))) validateQuiz(join(dir, 'quiz.json'));
  if (existsSync(join(dir, 'exercise.json'))) validateExercise(join(dir, 'exercise.json'));
}

const codes = readdirSync(MODULES_DIR).filter((d) => statSync(join(MODULES_DIR, d)).isDirectory());
console.log(`Validating ${codes.length} module folder(s)...\n`);
for (const code of codes) {
  console.log(`● ${code}`);
  const dir = join(MODULES_DIR, code);
  validateLevel(dir, `${code}/L1`);
  const l2 = join(dir, 'l2');
  if (existsSync(l2)) validateLevel(l2, `${code}/L2`);
}
console.log(`\n${errors} error(s), ${warns} warning(s).`);
process.exit(errors ? 1 : 0);
