#!/usr/bin/env node

/**
 * This script checks for JavaScript files that have TypeScript counterparts in the same directory.
 * It recursively scans the src directory and reports any duplicate files found.
 * 
 * During TypeScript migration, developers sometimes create new TypeScript files (.ts/.tsx)
 * but forget to delete the original JavaScript (.js) files. This script helps identify
 * such cases to ensure clean migration.
 * 
 * Usage:
 *   node scripts/find-duplicate-js-files.js
 * 
 * Exit codes:
 *   0 - No duplicate files found
 *   1 - Duplicate files found (error)
 */

const fs = require('fs');
const path = require('path');

const EXCLUDED_DIRS = ['node_modules', 'build', 'dist', 'coverage', '.git', 'flow-typed', 'public'];

/**
 * Recursively gets all files in a directory
 * @param {string} dir - Directory to scan
 * @param {Array<string>} fileList - Accumulator for file paths
 * @returns {Array<string>} List of file paths
 */
function getAllFiles(dir, fileList = []) {
  if (!dir || typeof dir !== 'string') {
    console.warn('Invalid directory path provided');
    return fileList;
  }

  try {
    const files = fs.readdirSync(dir);
    
    for (const file of files) {
      if (!file || typeof file !== 'string') {
        continue;
      }
      
      const filePath = path.join(dir, file);
      
      try {
        const stat = fs.statSync(filePath);
        
        if (stat.isDirectory()) {
          if (EXCLUDED_DIRS.includes(file)) {
            continue;
          }
          
          getAllFiles(filePath, fileList);
        } else {
          fileList.push(filePath);
        }
      } catch (err) {
        console.warn(`Warning: Could not access ${filePath}: ${err.message}`);
      }
    }
  } catch (err) {
    console.warn(`Warning: Could not read directory ${dir}: ${err.message}`);
  }
  
  return fileList;
}

/**
 * Finds JavaScript files that have TypeScript counterparts in the same directory
 * @param {string} srcDir - Source directory to scan
 * @returns {Array<Object>} List of duplicate JavaScript files with their TypeScript counterparts
 */
function findDuplicateJsFiles(srcDir) {
  if (!srcDir || typeof srcDir !== 'string') {
    console.warn('Invalid source directory provided');
    return [];
  }

  const allFiles = getAllFiles(srcDir);
  const duplicates = [];
  
  const filesByDir = {};
  
  for (const filePath of allFiles) {
    if (!filePath || typeof filePath !== 'string') {
      continue;
    }
    
    const dir = path.dirname(filePath);
    const fileName = path.basename(filePath);
    
    if (!filesByDir[dir]) {
      filesByDir[dir] = [];
    }
    
    filesByDir[dir].push(fileName);
  }
  
  for (const dir of Object.keys(filesByDir)) {
    const dirFiles = filesByDir[dir];
    const baseNames = {};
    
    for (const fileName of dirFiles) {
      if (!fileName || typeof fileName !== 'string') {
        continue;
      }
      
      const ext = path.extname(fileName);
      const baseName = fileName.replace(ext, '');
      
      if (!baseNames[baseName]) {
        baseNames[baseName] = [];
      }
      
      baseNames[baseName].push(fileName);
    }
    
    for (const baseName of Object.keys(baseNames)) {
      const files = baseNames[baseName];
      
      if (files.length > 1) {
        const hasJs = files.some(f => f && typeof f === 'string' && f.endsWith('.js'));
        const hasTs = files.some(f => f && typeof f === 'string' && (f.endsWith('.ts') || f.endsWith('.tsx')));
        
        if (hasJs && hasTs) {
          const jsFiles = files.filter(f => f && typeof f === 'string' && f.endsWith('.js'));
          const tsFiles = files.filter(f => f && typeof f === 'string' && (f.endsWith('.ts') || f.endsWith('.tsx')));
          
          for (const jsFile of jsFiles) {
            duplicates.push({
              jsFile: path.join(dir, jsFile),
              tsFiles: tsFiles.map(tsFile => path.join(dir, tsFile))
            });
          }
        }
      }
    }
  }
  
  return duplicates;
}

/**
 * Main function
 */
function main() {
  const srcDir = path.resolve(__dirname, '../src');
  console.log(`Checking for duplicate JS files in: ${srcDir}`);
  
  const duplicates = findDuplicateJsFiles(srcDir);
  
  if (duplicates && duplicates.length > 0) {
    console.error('Found JavaScript files that have TypeScript counterparts in the same directory:');
    console.error('These files should be deleted as part of the TypeScript migration process.\n');
    
    for (const duplicate of duplicates) {
      if (!duplicate || !duplicate.jsFile || !Array.isArray(duplicate.tsFiles)) {
        continue;
      }
      
      console.error(`JavaScript file: ${duplicate.jsFile}`);
      console.error(`TypeScript counterpart(s):`);
      
      for (const tsFile of duplicate.tsFiles) {
        if (!tsFile || typeof tsFile !== 'string') {
          continue;
        }
        console.error(`  - ${tsFile}`);
      }
      
      console.error('');
    }
    
    console.error(`Total: ${duplicates.length} duplicate file(s) found.`);
    process.exit(1); // Exit with error
  } else {
    console.log('No duplicate JavaScript files found.');
    process.exit(0); // Exit successfully
  }
}

// Execute the main function
main();
