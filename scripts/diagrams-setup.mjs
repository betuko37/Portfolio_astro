#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const vendorDir = path.join(root, "vendor", "archify");

if (fs.existsSync(path.join(vendorDir, "bin", "archify.mjs"))) {
  console.log("Archify ya está instalado en vendor/archify");
  process.exit(0);
}

fs.mkdirSync(path.join(root, "vendor"), { recursive: true });
const result = spawnSync(
  "git",
  ["clone", "--depth", "1", "https://github.com/tt-a1i/archify.git", vendorDir],
  { stdio: "inherit" },
);

if (result.status !== 0) {
  process.exit(result.status ?? 1);
}

console.log("✓ Archify instalado en vendor/archify");
