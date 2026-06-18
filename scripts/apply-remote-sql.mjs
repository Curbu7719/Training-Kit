// Apply a .sql file to a Supabase project via the Management API query endpoint.
// Usage: node scripts/apply-remote-sql.mjs <projectRef> <path-to-sql>
// Requires env SUPABASE_ACCESS_TOKEN.
import { readFileSync } from 'node:fs';

const [, , ref, sqlPath] = process.argv;
const token = process.env.SUPABASE_ACCESS_TOKEN;
if (!ref || !sqlPath || !token) {
  console.error('Need <projectRef> <sqlPath> and SUPABASE_ACCESS_TOKEN env.');
  process.exit(1);
}

const query = readFileSync(sqlPath, 'utf8');
const res = await fetch(`https://api.supabase.com/v1/projects/${ref}/database/query`, {
  method: 'POST',
  headers: {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ query }),
});

const text = await res.text();
if (!res.ok) {
  console.error(`HTTP ${res.status}: ${text}`);
  process.exit(1);
}
console.log(`OK (${res.status}): applied ${sqlPath}`);
console.log(text.slice(0, 300));
