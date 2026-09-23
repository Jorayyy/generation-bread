import { readFileSync, writeFileSync } from "node:fs";
import { globSync } from "node:fs";

const files = globSync("src/**/*.{ts,tsx}");
const map = new Map([
  ["â€¦", "…"],
  ["Â·", "·"],
  ["â‚±", "₱"],
  ["Ã—", "×"],
  ["â€\"", "—"],
]);

let fixedFiles = 0;
for (const file of files) {
  const original = readFileSync(file, "utf8");
  let next = original;
  for (const [from, to] of map) next = next.split(from).join(to);
  if (next !== original) {
    writeFileSync(file, next, "utf8");
    fixedFiles += 1;
    console.log("fixed", file);
  }
}
console.log("files fixed:", fixedFiles);
