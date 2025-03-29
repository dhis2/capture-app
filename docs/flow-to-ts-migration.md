# Flow to TypeScript Migration Plan for DHIS2 Capture App

## Current Status

The migration from Flow to TypeScript in the DHIS2 Capture App is in its early stages. Currently, only 5 TypeScript files exist in the codebase:

1. `src/components/AppStart/AppStart.component.tsx`
2. `src/components/AppStart/CacheExpired.component.tsx`
3. `src/components/AppStart/JSSProviderShell.component.tsx`
4. `src/components/AppStart/index.ts`
5. `src/declarations.d.ts`

## Migration Strategy

The migration will follow an incremental approach, converting files from Flow to TypeScript in logical groups while ensuring the application remains functional throughout the process. This approach minimizes risk and allows for continuous delivery of features during the migration.

### Phase 1: Infrastructure and Configuration Setup

**Status: In Progress**

1. ✅ Set up TypeScript configuration (`tsconfig.json`)
2. ✅ Configure ESLint for TypeScript
3. ✅ Fix ESLint configuration to require file extensions in TypeScript imports
4. ✅ Add TypeScript type checking to the build process
5. ✅ Create initial TypeScript declaration files

### Phase 2: Core Utilities and Shared Types

**Estimated Timeline: 2-3 weeks**

1. Create shared type definitions for common data structures
   - Define types for DHIS2 API responses
   - Define types for internal data models
   - Define types for Redux state
2. Convert utility functions to TypeScript
   - Target pure functions first (no side effects)
   - Focus on core utilities used throughout the application
3. Create TypeScript interfaces for configuration objects

### Phase 3: UI Components (Bottom-Up Approach)

**Estimated Timeline: 4-6 weeks**

1. Convert leaf components first (components with no child components)
   - Start with simple UI components
   - Focus on components with fewer dependencies
2. Convert form components and input fields
3. Convert higher-level components that use the converted leaf components
4. Update component props to use TypeScript interfaces

### Phase 4: Redux Store and Data Management

**Estimated Timeline: 4-6 weeks**

1. Convert Redux action creators to TypeScript
2. Convert Redux reducers to TypeScript
3. Convert Redux selectors to TypeScript
4. Convert Redux middleware and epics to TypeScript
5. Define TypeScript interfaces for the entire Redux state tree

### Phase 5: API Layer and Data Fetching

**Estimated Timeline: 3-4 weeks**

1. Convert API client code to TypeScript
2. Convert data transformation functions to TypeScript
3. Convert offline storage logic to TypeScript
4. Ensure proper typing for async operations

### Phase 6: Complex Features and Edge Cases

**Estimated Timeline: 4-6 weeks**

1. Convert complex features like rules engine
2. Convert program-specific logic
3. Convert working list functionality
4. Address any remaining Flow files

### Phase 7: Testing and Validation

**Estimated Timeline: 2-3 weeks**

1. Ensure all tests pass with TypeScript code
2. Add additional type tests where necessary
3. Validate type coverage across the codebase
4. Performance testing to ensure no regressions

## Implementation Guidelines

### File Conversion Process

For each file to be converted:

1. Create a new `.ts` or `.tsx` file with the same name as the `.js` file
2. Convert Flow type annotations to TypeScript
3. Update import statements to include file extensions for TypeScript files
4. Fix any type errors
5. Remove the original `.js` file
6. Update any imports in other files that reference the converted file

### Type Conversion Guidelines

| Flow Type | TypeScript Equivalent |
|-----------|------------------------|
| `any` | `any` (use sparingly) |
| `mixed` | `unknown` |
| `Object` | `Record<string, unknown>` or specific interface |
| `Function` | Specific function type or `(...args: any[]) => any` |
| `Class<T>` | `typeof T` |
| `$ReadOnly<T>` | `Readonly<T>` |
| `$ReadOnlyArray<T>` | `ReadonlyArray<T>` |
| `$Keys<T>` | `keyof T` |
| `$Values<T>` | `T[keyof T]` |
| `$Shape<T>` | `Partial<T>` |
| `$Diff<A, B>` | `Omit<A, keyof B>` |
| `$PropertyType<T, K>` | `T[K]` |
| `$ElementType<T, K>` | `T[K]` |

### Best Practices

1. **Avoid `any` Type**: Use more specific types whenever possible
2. **Use Type Inference**: Let TypeScript infer types when it's clear
3. **Create Interfaces for Props**: Define interfaces for component props
4. **Use Union Types**: For values that can be one of several types
5. **Use Generics**: For reusable components and functions
6. **Include File Extensions**: Always include `.ts` or `.tsx` extensions in imports
7. **Remove Flow Annotations**: Remove `// @flow` comments when converting files
8. **Update Tests**: Ensure tests are updated to work with TypeScript files

## Challenges and Considerations

1. **Complex Type Definitions**: Some Flow types may be complex to convert
2. **Third-Party Libraries**: Some libraries may not have TypeScript definitions
3. **Performance Impact**: Monitor build and type-checking performance
4. **Backward Compatibility**: Ensure converted code works with existing Flow code
5. **Testing Coverage**: Maintain test coverage during migration

## Success Metrics

1. **Type Coverage**: Percentage of code covered by TypeScript types
2. **Build Success**: Successful builds with TypeScript type checking
3. **Test Pass Rate**: All tests passing after migration
4. **Bug Reduction**: Fewer type-related bugs in production
5. **Developer Satisfaction**: Improved developer experience

## Conclusion

This migration plan provides a structured approach to converting the DHIS2 Capture App from Flow to TypeScript. By following an incremental approach and focusing on logical groups of files, we can minimize risk and ensure the application remains functional throughout the migration process.
