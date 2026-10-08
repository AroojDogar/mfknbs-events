// Generates supabase/seed.sql from lib/events-data.ts  →  npm run seed:sql
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import ts from "typescript";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const src = readFileSync(path.join(root, "lib/events-data.ts"), "utf8").replace(/^import .*$/m, "");
const js = ts.transpileModule(src, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2020 } }).outputText;
const { seedEvents } = await import("data:text/javascript;base64," + Buffer.from(js).toString("base64"));

const q = (v) => (v === null || v === undefined ? "null" : `'${String(v).replace(/'/g, "''")}'`);
const arr = (a) => (a && a.length ? `array[${a.map(q).join(", ")}]::text[]` : "'{}'::text[]");

const rows = seedEvents.map((e) =>
  `(${[q(e.slug), q(e.title), q(e.date), q(e.end_date ?? null), e.date_approx ? "true" : "false", q(e.category), q(e.summary), q(e.description), arr(e.highlights), arr(e.people), q(e.venue ?? null), arr(e.images), e.featured ? "true" : "false"].join(", ")})`,
);

const sql = `-- Starting events for MFKNBS (generated from lib/events-data.ts). Run after schema.sql.
insert into public.events (slug, title, date, end_date, date_approx, category, summary, description, highlights, people, venue, images, featured) values
${rows.join(",\n")}
on conflict (slug) do nothing;
`;
writeFileSync(path.join(root, "supabase/seed.sql"), sql);
console.log(`Wrote supabase/seed.sql with ${rows.length} events`);
