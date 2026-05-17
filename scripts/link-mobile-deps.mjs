// Some mobile-only packages (notably `expo-router`) don't hoist to the
// workspace root under npm's default install strategy. The deeply-nested
// `@expo/cli` walks up from `node_modules/expo/...` looking for them, so
// they must exist at `node_modules/<pkg>` even when the mobile workspace
// is their only declared consumer. This script makes the symlinks
// idempotent so a fresh `npm install` always leaves the dev server in a
// working state.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '..');

const PACKAGES_TO_LINK = ['expo-router'];

for (const pkg of PACKAGES_TO_LINK) {
  const target = path.join(repoRoot, 'apps', 'mobile', 'node_modules', pkg);
  const linkPath = path.join(repoRoot, 'node_modules', pkg);

  if (!fs.existsSync(target)) {
    // The mobile workspace hasn't installed it yet — nothing to link.
    continue;
  }
  if (fs.existsSync(linkPath)) {
    // Already present (either npm hoisted it or a prior run linked it).
    continue;
  }

  const relativeTarget = path.relative(path.dirname(linkPath), target);
  fs.symlinkSync(relativeTarget, linkPath, 'dir');
  console.log(`[link-mobile-deps] linked ${pkg} → ${relativeTarget}`);
}
