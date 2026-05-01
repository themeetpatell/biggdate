#!/usr/bin/env node

import { readFileSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";

const requiredDocs = [
  "README.md",
  "CONTRIBUTING.md",
  "docs/README.md",
  "docs/guides/development.md",
  "docs/standards/repository-standards.md",
];

const markdownFiles = [
  "README.md",
  "CONTRIBUTING.md",
  "docs/README.md",
  "docs/guides/development.md",
  "docs/standards/repository-standards.md",
];

let hasError = false;

function fail(message) {
  hasError = true;
  console.error(`ERROR: ${message}`);
}

function checkRequiredDocs() {
  for (const file of requiredDocs) {
    if (!existsSync(file)) {
      fail(`Missing required doc: ${file}`);
    }
  }
}

function extractLinks(markdown) {
  const regex = /\[[^\]]+\]\(([^)]+)\)/g;
  const links = [];
  let match;
  while ((match = regex.exec(markdown)) !== null) {
    links.push(match[1]);
  }
  return links;
}

function isLocalDocLink(link) {
  if (link.startsWith("http://") || link.startsWith("https://") || link.startsWith("mailto:")) {
    return false;
  }
  if (link.startsWith("#")) return false;
  return true;
}

function stripAnchor(link) {
  return link.split("#")[0];
}

function checkMarkdownLinks() {
  for (const file of markdownFiles) {
    if (!existsSync(file)) continue;
    const content = readFileSync(file, "utf8");
    const links = extractLinks(content);
    const baseDir = dirname(file);

    for (const link of links) {
      if (!isLocalDocLink(link)) continue;
      const normalized = stripAnchor(link);
      if (!normalized) continue;

      const target = resolve(baseDir, normalized);
      if (!existsSync(target)) {
        fail(`Broken local link in ${file}: ${link}`);
      }
    }
  }
}

function main() {
  checkRequiredDocs();
  checkMarkdownLinks();

  if (hasError) {
    process.exit(1);
  }

  console.log("Documentation check passed.");
}

main();
