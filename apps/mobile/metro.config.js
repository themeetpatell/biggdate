// Metro configuration for the BiggDate monorepo.
// Adds the repo root to Metro's watch + module-resolution paths so
// `@biggdate/shared` and other workspace packages resolve cleanly.
// Spreads Expo's defaults rather than replacing them — expo-doctor
// flags missing watchFolders when defaults are dropped.
const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");

const projectRoot = __dirname;
const monorepoRoot = path.resolve(projectRoot, "../..");

const config = getDefaultConfig(projectRoot);

config.watchFolders = [...(config.watchFolders ?? []), monorepoRoot];
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, "node_modules"),
  path.resolve(monorepoRoot, "node_modules"),
];

module.exports = config;
