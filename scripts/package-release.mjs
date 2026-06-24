import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const rootDir = path.resolve(import.meta.dirname, "..");
const distDir = path.join(rootDir, "dist");
const manifestPath = path.join(rootDir, "manifest.json");
const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));

const runtimePaths = [
  "manifest.json",
  "popup.html",
  "popup.css",
  "popup.js",
  "lib/numerology.js",
  "lib/meanings.js",
  "icons/icon16.png",
  "icons/icon32.png",
  "icons/icon48.png",
  "icons/icon128.png",
];

const missingPaths = runtimePaths.filter((relPath) => !fs.existsSync(path.join(rootDir, relPath)));
if (missingPaths.length) {
  throw new Error(`Missing runtime files:\n${missingPaths.join("\n")}`);
}

const descriptionLength = manifest.description.length;
if (descriptionLength > 132) {
  throw new Error(`manifest.description is ${descriptionLength} characters; Chrome Web Store allows at most 132.`);
}

fs.mkdirSync(distDir, { recursive: true });

const zipName = `numerologycalc-chrome-extension-v${manifest.version}.zip`;
const zipPath = path.join(distDir, zipName);
fs.rmSync(zipPath, { force: true });

execFileSync("zip", ["-r", zipPath, ...runtimePaths], {
  cwd: rootDir,
  stdio: "inherit",
});

console.log(`Created ${path.relative(rootDir, zipPath)}`);
console.log(`manifest.description length: ${descriptionLength}`);
