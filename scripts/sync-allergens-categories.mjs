import { readFileSync } from "node:fs";
import { Client } from "pg";
import { products } from "../src/data/products.ts";

for (const line of readFileSync(".env.local", "utf8").split(/\r?\n/)) {
  if (!line || line.startsWith("#") || !line.includes("=")) continue;
  const i = line.indexOf("=");
  process.env[line.slice(0, i)] = line.slice(i + 1);
}

const CATEGORY_IMAGES = {
  breads:
    "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1200&q=85",
  pastries:
    "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=1200&q=85",
  cakes:
    "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=1200&q=85",
};

const client = new Client({ connectionString: process.env.DATABASE_URL });
await client.connect();

let updatedProducts = 0;
for (const seed of products) {
  const rows = await client.query("SELECT data FROM products WHERE id = $1", [seed.id]);
  if (!rows.rows[0]) continue;
  const data = rows.rows[0].data;
  const seedAllergens = seed.allergens ?? [];
  const needs =
    !data.allergens ||
    data.allergens.length === 0 ||
    JSON.stringify(data.allergens) !== JSON.stringify(seedAllergens);
  if (!needs) continue;
  const next = { ...data, allergens: seedAllergens, diet: seed.diet ?? [] };
  await client.query("UPDATE products SET data = $2::jsonb, updated_at = $3 WHERE id = $1", [
    seed.id,
    JSON.stringify(next),
    new Date().toISOString(),
  ]);
  updatedProducts += 1;
}

let updatedCategories = 0;
const cats = await client.query("SELECT id, data FROM categories");
for (const row of cats.rows) {
  const data = row.data;
  const image = CATEGORY_IMAGES[data.slug];
  if (!image || data.image === image) continue;
  const next = { ...data, image };
  await client.query("UPDATE categories SET data = $2::jsonb WHERE id = $1", [
    row.id,
    JSON.stringify(next),
  ]);
  updatedCategories += 1;
}

console.log(`updated products: ${updatedProducts}`);
console.log(`updated categories: ${updatedCategories}`);
await client.end();
