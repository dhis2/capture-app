# Flow to TypeScript Migration Guide

This document outlines the process for incrementally migrating this application from Flow to TypeScript.

## Setup (Already Completed)

The following packages and configurations have been added to support TypeScript:

1. TypeScript and related packages:
   - `typescript`
   - `@babel/preset-typescript`
   - Type definitions for React: `@types/react` and `@types/react-dom`
   - Type definitions for Node: `@types/node`

2. Configuration files:
   - `tsconfig.json`: TypeScript configuration
   - `tsconfig.checkts.json`: TypeScript configuration for type checking only TypeScript files
   - Updated `.babelrc`: Added TypeScript preset
   - Updated `.eslintrc`: Added TypeScript support
   - `src/declarations.d.ts`: Global declarations for handling JS imports

## Migration Process

### Step 1: Creating New Files

When creating new components or modules, use TypeScript instead of Flow:
- Use `.ts` extension for TypeScript files
- Use `.tsx` extension for TypeScript files that include JSX

### Step 2: Converting Existing Files

To migrate an existing file from Flow to TypeScript:

1. Create a copy of the file with `.ts` or `.tsx` extension
2. Convert Flow type annotations to TypeScript:
   - Change `// @flow` to TypeScript syntax
   - Convert type annotations (see conversion guide below)
3. Update imports to use the TypeScript version of dependencies
4. Once the TypeScript version is working, remove the Flow version

### Handling Imports During Migration

We've set up the project to handle imports from JavaScript (Flow) files automatically with minimal setup:

1. TypeScript is configured with `noImplicitAny: false` to allow implicit any types for imports
2. The global `declarations.d.ts` file defines wildcard module declarations for JS files and specific directories

This means you generally won't need to create individual `.d.ts` files for each component. The imports will be treated as `any` type, which simplifies the incremental migration process.

For libraries or modules that need more specific typing, you can add them to the `declarations.d.ts` file, like:

```typescript
declare module 'specific-module' {
  export function someFunction(): void;
  // other exports
}
```

### Importing TypeScript files in Flow files

To import TypeScript files in Flow files without Flow type checking errors, we use a global approach that treats all TypeScript imports as `any`:

1. Create a very simple `flow-typed/typescript.js.flow` file:

```javascript
// @flow

// This file enables Flow to treat all TypeScript imports as 'any'
// No need to manually declare each component or its exports

// This creates a generic handler for any named export from a TypeScript module
declare module.exports: any;
```

2. Configure Flow to use this file for all TypeScript imports in `.flowconfig`:

```
[options]
# Handle TypeScript imports from Flow - all TypeScript imports treated as any
module.name_mapper='.*\.\(ts\|tsx\)$' -> '<PROJECT_ROOT>/flow-typed/typescript.js.flow'

# Make sure Flow recognizes TypeScript file extensions
module.file_ext=.js
module.file_ext=.jsx
module.file_ext=.json
module.file_ext=.ts
module.file_ext=.tsx
```

With this setup, you can import any TypeScript component or function in your Flow files without needing to create declaration files for each component. All imports will be treated as `any` types.

**Benefits of this approach:**
- No need to manually declare each TypeScript component
- No need to update declarations when you change TypeScript component exports
- Works automatically for new TypeScript files

**Note**: While this approach is convenient during migration, it does sacrifice type safety at the Flow-TypeScript boundary. Once your migration is complete, this won't be an issue.

### Incremental Type Checking

The TypeScript configuration is set up to:
- Allow JavaScript files with `allowJs: true` in main `tsconfig.json`
- Skip type checking of JavaScript files with `checkJs: false`
- Use a separate `tsconfig.checkts.json` that only checks `.ts` and `.tsx` files
- Allow implicit any types for imports with `noImplicitAny: false`

This means TypeScript will only report errors in `.ts` and `.tsx` files, allowing for a smooth incremental migration where Flow and TypeScript can coexist during the transition.

### Type Conversion Guide

| Flow | TypeScript |
|------|------------|
| `string` | `string` |
| `number` | `number` |
| `boolean` | `boolean` |
| `null` | `null` |
| `void` | `void` |
| `any` | `any` |
| `mixed` | `unknown` |
| `{[key: string]: any}` | `Record<string, any>` |
| `Array<T>` | `Array<T>` or `T[]` |
| `?T` (nullable) | `T \| null \| undefined` |
| Function types | Interface or type alias with function signature |
| Interface | Interface or type alias |
| Generic types | Similar syntax, but with different constraints |

### React Component Migration

For React components:

1. Use React's TypeScript types:
   - Function components: `React.FC<Props>`
   - Class components: `React.Component<Props, State>`
   - Hooks: e.g., `useState<T>`, `useRef<T>`, etc.

2. Define prop interfaces or types:
```typescript
interface MyComponentProps {
  name: string;
  count?: number; // Optional prop
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

const MyComponent: React.FC<MyComponentProps> = ({ name, count = 0, onClick }) => {
  // Component implementation
};
```

### Common TypeScript Patterns for External Libraries

When working with libraries that don't have proper TypeScript types or return complex types:

1. Use type assertions for translation functions:
```typescript
// For i18n translation functions that return complex types
i18n.t('some.translation.key') as string
```

2. Use declaration merging to extend library types when needed.

3. For frequently used untyped dependencies, add them to the global declarations file:
```typescript
// src/declarations.d.ts
declare module 'some-library' {
  export function doSomething(input: string): string;
  // ... other exports
}
```

### Testing Your Migration

Run the following commands to check your TypeScript files:

```bash
# Check TypeScript types
yarn tsc:check

# Run eslint
yarn linter:check
```

### ESLint Configuration

Our ESLint configuration ensures that TypeScript files follow the same coding standards as Flow files. We've configured ESLint to:

1. Use the same base rules for TypeScript files as for Flow files
2. Use TypeScript-specific rules where appropriate (e.g., `@typescript-eslint/indent` instead of `indent`)
3. Disable Flow-specific rules for TypeScript files
4. Set `@typescript-eslint/no-explicit-any` to "warn" rather than "error" during the migration phase

The configuration for TypeScript files is in the `.eslintrc` file's `overrides` section. This ensures consistent code style across your codebase during the incremental migration.

### Continuous Integration

TypeScript type checking is part of our CI pipeline on GitHub Actions. This ensures all TypeScript files remain type-safe throughout the migration process. The workflow:

1. Runs Flow checking on Flow files
2. Runs TypeScript checking on TypeScript files
3. Ensures both type systems pass on their respective files

The GitHub Actions workflow runs these checks on every push and pull request, preventing TypeScript type errors from being merged into the codebase.

## Best Practices for Incremental Migration

1. **Focus on one module at a time**: Convert all files within a specific feature or component before moving to the next.
2. **Start with leaf components**: Begin with components that have few dependencies and work up to more complex ones.
3. **Use TypeScript's flexibility**: Take advantage of `any` or `unknown` types initially to ease migration, then refine types later.
4. **Test thoroughly**: After each conversion, test the component to ensure it works as expected.
5. **Update imports gradually**: As you convert files, update imports in other files to point to the new TypeScript versions.

## Benefits of TypeScript Over Flow

- Better tooling and IDE support
- Larger community and more up-to-date type definitions
- More frequent updates and active maintenance
- Better integration with popular libraries
- Improved build times and performance

## Additional Resources

- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [React TypeScript Cheatsheet](https://github.com/typescript-cheatsheets/react)
- [Flow to TypeScript conversion guide](https://github.com/bcherny/flow-to-typescript)
- [TypeScript Playground](https://www.typescriptlang.org/play) 