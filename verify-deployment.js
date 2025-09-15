#!/usr/bin/env node

/**
 * Deployment Verification Script
 * This script verifies that all required files exist and builds successfully
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

console.log('🔍 Verifying BiggDate deployment readiness...\n');

// Check if required files exist
const requiredFiles = [
  'src/components/Messages.jsx',
  'src/App.jsx',
  'package.json',
  'vite.config.prod.js',
  'vercel.json'
];

console.log('📁 Checking required files...');
let allFilesExist = true;

requiredFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file} - MISSING`);
    allFilesExist = false;
  }
});

if (!allFilesExist) {
  console.log('\n❌ Some required files are missing. Please check the errors above.');
  process.exit(1);
}

// Check if Messages component is properly imported
console.log('\n🔗 Checking Messages import...');
const appContent = fs.readFileSync('src/App.jsx', 'utf8');
if (appContent.includes("import('./components/Messages')")) {
  console.log('✅ Messages component properly imported');
} else {
  console.log('❌ Messages component import not found');
  process.exit(1);
}

// Check if Messages component exports default
console.log('\n📤 Checking Messages component export...');
const messagesContent = fs.readFileSync('src/components/Messages.jsx', 'utf8');
if (messagesContent.includes('export default Messages')) {
  console.log('✅ Messages component properly exports default');
} else {
  console.log('❌ Messages component does not export default');
  process.exit(1);
}

// Test build
console.log('\n🔨 Testing build...');
try {
  execSync('npm run build', { stdio: 'pipe' });
  console.log('✅ Build successful');
} catch (error) {
  console.log('❌ Build failed:');
  console.log(error.stdout.toString());
  console.log(error.stderr.toString());
  process.exit(1);
}

console.log('\n🎉 All checks passed! Ready for deployment.');
console.log('\n📋 Deployment options:');
console.log('1. Vercel: Connect GitHub repo at vercel.com');
console.log('2. Netlify: Connect GitHub repo at netlify.com');
console.log('3. Docker: Run ./deploy.sh');
console.log('4. Static: Upload dist/ folder to any static host');
