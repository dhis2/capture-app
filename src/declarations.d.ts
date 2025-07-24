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
        t: (key: string, options?: any) => any;
        // Add other methods as needed
    };
    export default i18n;
}

declare module 'd2-utilizr/lib/isFunction' {
    const isFunction: (value: any) => boolean;
    export default isFunction;
}

declare module '*.module.css' {
    const classes: { [key: string]: string };
    export default classes;
}

declare module '@dhis2/app-runtime/experimental' {
    export const Plugin: any;
}
