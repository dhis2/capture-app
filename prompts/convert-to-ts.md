
I need to convert my React application from Flow to TypeScript. Please help me convert the following files while maintaining the git history. This means I need to rename the files rather than create new ones.

Key requirements:
1. Convert Flow type annotations to TypeScript equivalents
2. Prefer 'type' over 'interface' when possible
3. Don't add unnecessary React.FC<> type annotations to components
4. Rename files from .js to .tsx (for React components) or .ts (for non-React files)
5. Update type imports/exports as needed
6. Use proper TypeScript conventions (semicolons instead of commas in type definitions)

When converting types:
- Replace 'Object' with more specific types like 'Record<string, unknown>'
- Use 'unknown' instead of 'any' where possible for better type safety
- Convert Flow's exact object types ({| |}) to regular TypeScript object types
- Convert 'mixed' to 'unknown' in TypeScript

## Rules

- NEVER create a new file unless explicitly asked to do so, only rename existing ones
- Make sure to remove any Flow comments and type annotations

### Global Type Declarations

For files like `typeDeclarations.js` that define global types with Flow:

1. Create a new `.d.ts` file
2. Use `declare global { ... }` to make types available globally
3. Use TypeScript interfaces and types inside the global declaration
4. Export an empty object at the end with `export {};`

### File Renaming

- React components: `.js` → `.tsx` 
- Non-React TypeScript files: `.js` → `.ts`
- Type declaration files: `.js` → `.d.ts`
- Style and asset files: Keep as is

### React Component Conversion

- Remove Flow comment (`// @flow`)
- Replace Flow type annotations with TypeScript
- No need to add `React.FC<Props>` to function components
- Prefer `type Props = {...}` over `interface Props {...}`
- Fix component exports and imports

### Redux Store and Actions

- Use more specific types than just `any` for actions and payloads if possible

### Common Gotchas

- Remember to fix imports when moving to TypeScript (add explicit extensions if needed)
- Fix any linter errors that arise after conversion
- Watch for Flow-specific utilities that need TypeScript equivalents
- Pay attention to nullable types (`?string` in Flow vs `string | null | undefined` in TypeScript)
- Consider using TypeScript utility types (Partial, Readonly, Pick, etc.)

## Example Conversion Workflow

1. Identify a standalone component or module to convert
2. Examine dependencies and type imports
3. Convert global type definitions first if they exist
4. Convert each file, starting with the most basic ones
5. NEVER create a new file, only rename existing ones
6. Rename files to appropriate TypeScript extensions
7. Test the application to ensure functionality is preserved
