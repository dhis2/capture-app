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
  try {
    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
      const filePath = path.join(dir, file);
      
      try {
        const stat = fs.statSync(filePath);
        
        if (stat.isDirectory()) {
          if (EXCLUDED_DIRS.includes(file)) {
            return;
          }
          
          getAllFiles(filePath, fileList);
        } else {
          fileList.push(filePath);
        }
      } catch (err) {
        console.warn(`Warning: Could not access ${filePath}: ${err.message}`);
      }
    });
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
  const allFiles = getAllFiles(srcDir);
  const duplicates = [];
  
  const filesByDir = {};
  
  allFiles.forEach(filePath => {
    const dir = path.dirname(filePath);
    const fileName = path.basename(filePath);
    
    if (!filesByDir[dir]) {
      filesByDir[dir] = [];
    }
    
    filesByDir[dir].push(fileName);
  });
  
  Object.keys(filesByDir).forEach(dir => {
    const dirFiles = filesByDir[dir];
    const baseNames = {};
    
    dirFiles.forEach(fileName => {
      const ext = path.extname(fileName);
      const baseName = fileName.replace(ext, '');
      
      if (!baseNames[baseName]) {
        baseNames[baseName] = [];
      }
      
      baseNames[baseName].push(fileName);
    });
    
    Object.keys(baseNames).forEach(baseName => {
      const files = baseNames[baseName];
      
      if (files.length > 1) {
        const hasJs = files.some(f => f.endsWith('.js'));
        const hasTs = files.some(f => f.endsWith('.ts') || f.endsWith('.tsx'));
        
        if (hasJs && hasTs) {
          const jsFiles = files.filter(f => f.endsWith('.js'));
          const tsFiles = files.filter(f => f.endsWith('.ts') || f.endsWith('.tsx'));
          
          jsFiles.forEach(jsFile => {
            duplicates.push({
              jsFile: path.join(dir, jsFile),
              tsFiles: tsFiles.map(tsFile => path.join(dir, tsFile))
            });
          });
        }
      }
    });
  });
  
  return duplicates;
}

/**
 * Main function
 */
function main() {
  const srcDir = path.resolve(__dirname, '../src');
  console.log(`Checking for duplicate JS files in: ${srcDir}`);
  
  const duplicates = findDuplicateJsFiles(srcDir);
  
  if (duplicates.length > 0) {
    console.error('Found JavaScript files that have TypeScript counterparts in the same directory:');
    console.error('These files should be deleted as part of the TypeScript migration process.\n');
    
    duplicates.forEach(({ jsFile, tsFiles }) => {
      console.error(`JavaScript file: ${jsFile}`);
      console.error(`TypeScript counterpart(s):`);
      tsFiles.forEach(tsFile => {
        console.error(`  - ${tsFile}`);
      });
      console.error('');
    });
    
    console.error(`Total: ${duplicates.length} duplicate file(s) found.`);
    process.exit(1); // Exit with error
  } else {
    console.log('No duplicate JavaScript files found.');
    process.exit(0); // Exit successfully
  }
}

main();
