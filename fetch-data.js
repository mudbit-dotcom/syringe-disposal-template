import fs from "fs";
import path from "node:path";

const url = "https://data.cityofnewyork.us/resource/r465-fr2q.json";
console.log(url);
const response = await fetch(url);
const syringe = await response.json();
console.log(syringe);
const subcategories = syringe.map(syringe => syringe.subcategoryname);
console.log(subcategories);

const dataDir = path.join("src", "lib", "data");
fs.mkdirSync(dataDir, { recursive: true });

const outputPath = path.join(dataDir, "syringes.json");
fs.writeFileSync(outputPath, JSON.stringify(syringe, null, 2));
console.log(`Saved to ${outputPath}`);