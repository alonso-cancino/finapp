#!/usr/bin/env node
import { readFileSync, writeFileSync, existsSync } from "fs";
import { execSync } from "child_process";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");

// Read .env
const envPath = resolve(ROOT, ".env");
if (!existsSync(envPath)) {
  console.error("Missing .env file. Copy .env.example to .env and fill in values.");
  process.exit(1);
}

const env = Object.fromEntries(
  readFileSync(envPath, "utf-8")
    .split("\n")
    .filter((l) => l.trim() && !l.startsWith("#"))
    .map((l) => {
      const i = l.indexOf("=");
      return [l.slice(0, i).trim(), l.slice(i + 1).trim()];
    })
);

const sheetId = env.SHEET_ID;
const secretToken = env.SECRET_TOKEN || "";

if (!sheetId) {
  console.error("SHEET_ID is required in .env");
  process.exit(1);
}

// Read source, inject values
let code = readFileSync(resolve(ROOT, "apps-script.js"), "utf-8");
code = code.replace(
  /const SHEET_ID = ".*?";/,
  `const SHEET_ID = "${sheetId}";`
);
code = code.replace(
  /const SECRET_TOKEN = ".*?";/,
  `const SECRET_TOKEN = "${secretToken}";`
);

// Write processed file to gas/
writeFileSync(resolve(ROOT, "gas/Code.js"), code);
console.log("Injected SHEET_ID and SECRET_TOKEN into gas/Code.js");

// Check .clasp.json exists
if (!existsSync(resolve(ROOT, ".clasp.json"))) {
  console.error(
    "Missing .clasp.json. Create it with:\n" +
    '  { "scriptId": "YOUR_SCRIPT_ID", "rootDir": "gas" }\n\n' +
    "Get your script ID from Apps Script > Project Settings > Script ID"
  );
  process.exit(1);
}

// Push to Apps Script
try {
  execSync("npx @google/clasp push", { cwd: ROOT, stdio: "inherit" });
  console.log("\nApps Script updated successfully.");
} catch {
  console.error("\nclasp push failed. Make sure you've run: npx @google/clasp login");
  process.exit(1);
}
