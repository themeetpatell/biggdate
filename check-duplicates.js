#!/usr/bin/env node

/**
 * Check for duplicate keys in Connections.jsx
 */

import fs from 'fs';

console.log('🔍 Checking for duplicate keys in Connections.jsx...\n');

const content = fs.readFileSync('src/components/Connections.jsx', 'utf8');

// Find all JavaScript object literals (not CSS classes) and check for duplicate keys
const lines = content.split('\n');
let duplicateFound = false;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  
  // Look for object literals that start with { and contain key: value pairs
  if (line.includes('{') && line.includes(':')) {
    // Check if this is a JavaScript object (not CSS class)
    if (line.includes('className') || line.includes('style') || line.includes('const') || line.includes('let') || line.includes('var')) {
      continue; // Skip CSS classes
    }
    
    // Extract key-value pairs from the line
    const keyValuePairs = line.match(/(\w+)\s*:/g);
    
    if (keyValuePairs && keyValuePairs.length > 1) {
      const keys = keyValuePairs.map(kv => kv.replace(':', '').trim());
      const uniqueKeys = new Set(keys);
      
      if (keys.length !== uniqueKeys.size) {
        console.log(`❌ Duplicate keys found on line ${i + 1}:`);
        const duplicates = keys.filter((key, index) => keys.indexOf(key) !== index);
        console.log(`   Line: ${line.trim()}`);
        console.log(`   Duplicates: ${[...new Set(duplicates)].join(', ')}`);
        duplicateFound = true;
      }
    }
  }
}

if (!duplicateFound) {
  console.log('✅ No duplicate keys found in Connections.jsx');
  console.log('✅ File is ready for deployment');
} else {
  console.log('\n❌ Duplicate keys found. Please fix before deploying.');
  process.exit(1);
}

console.log('\n🎉 All checks passed!');
