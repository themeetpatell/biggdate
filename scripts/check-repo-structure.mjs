#!/usr/bin/env node

import { existsSync } from "node:fs";
import { execSync } from "node:child_process";

const requiredPaths = [
  "src",
  "src/app",
  "src/components",
  "src/lib",
  "public",
  "scripts",
  "supabase/migrations",
  "docs",
];

const trackedForbiddenPatterns = [
  /^\.DS_Store$/,
  /^\.next\//,
  /^dist\//,
  /^out\//,
  /^node_modules\//,
];

let hasError = false;

function fail(message) {
  hasError = true;
  console.error(`ERROR: ${message}`);
}

function checkRequiredPaths() {
  for (const path of requiredPaths) {
    if (!existsSync(path)) {
      fail(`Missing required path: ${path}`);
    }
  }
}

function checkInstrumentationDuplication() {
  const rootInstrumentation = existsSync("instrumentation.ts") || existsSync("instrumentation.js");
  const srcInstrumentation = existsSync("src/instrumentation.ts") || existsSync("src/instrumentation.js");

  if (rootInstrumentation && srcInstrumentation) {
    fail("Duplicate instrumentation entrypoint found in both root and src/.");
  }

  const rootInstrumentationClient =
    existsSync("instrumentation-client.ts") || existsSync("instrumentation-client.js");
  const srcInstrumentationClient =
    existsSync("src/instrumentation-client.ts") || existsSync("src/instrumentation-client.js");

  if (rootInstrumentationClient && srcInstrumentationClient) {
    fail("Duplicate instrumentation-client entrypoint found in both root and src/.");
  }
}

function checkTrackedFiles() {
  const output = execSync("git ls-files", { encoding: "utf-8" });
  const files = output.split("\n").filter(Boolean);

  for (const file of files) {
    if (trackedForbiddenPatterns.some((pattern) => pattern.test(file))) {
      fail(`Forbidden tracked artifact: ${file}`);
    }
  }
}

function main() {
  checkRequiredPaths();
  checkInstrumentationDuplication();
  checkTrackedFiles();

  if (hasError) {
    process.exit(1);
  }

  console.log("Repository structure check passed.");
}

main();
