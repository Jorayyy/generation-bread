import { readFileSync } from "node:fs";
import { Client } from "pg";

for (const line of readFileSync(".env.local", "utf8").split(/\r?\n/)) {
  if (!line || line.startsWith("#") || !line.includes("=")) continue;
  const i = line.indexOf("=");
  process.env[line.slice(0, i)] = line.slice(i + 1);
}

const u = (id) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1200&q=85`;

const map = {
  "ube-cheese-pandesal": u("photo-1558961363-fa8fdf82db35"),
  "classic-pandesal": u("photo-1509440159596-0249088772ff"),
  "three-day-croissant": u("photo-1555507036-ab1f4038808a"),
  "pain-au-chocolat": u("photo-1623334044303-241021148842"),
  "egg-tart": u("photo-1519915028121-7d3463d20b13"),
  "crookie": u("photo-1499636136210-6f4ee915583e"),
  "pande-coco": u("photo-1555507036-ab1f4038808a"),
  "cheese-rolls": u("photo-1586444248902-2f64eddc13df"),
  "sourdough-loaf": u("photo-1585478259715-876acc5be8eb"),
  "new-york-cheesecake": u("photo-1533134242443-d4fd215305ad"),
};

const client = new Client({ connectionString: process.env.DATABASE_URL });
await client.connect();
for (const [slug, url] of Object.entries(map)) {
  const r = await client.query(
    `UPDATE products
     SET data = jsonb_set(data, '{images}', $1::jsonb),
         updated_at = now()
     WHERE slug = $2
     RETURNING slug`,
    [JSON.stringify([url]), slug]
  );
  console.log(r.rowCount ? `updated ${slug}` : `MISSING ${slug}`);
}
await client.end();
