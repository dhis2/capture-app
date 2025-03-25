// This file allows TypeScript to import JavaScript files without type definitions
// Essentially making all JS imports have an implicit "any" type

// Allow imports of JavaScript modules
declare module '*.js';

// Allow imports from specific directories
declare module 'src/components/*';
declare module 'src/styles/*';
declare module 'src/core_modules/*';

// Add additional declarations for any problematic imports
declare module '@dhis2/d2-i18n' {
    const i18n: {
        t: (key: string, options?: any) => string;
        // Add other methods as needed
    };
    export default i18n;
}
