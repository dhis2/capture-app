import type { TerminologyContext } from './applyCustomTerminology';

// Module-level stack of explicit program contexts. A stack (rather than a single
// value) correctly handles nested providers — e.g. a cross-program relationships
// widget inside a program-scoped page shell.
//
// Correctness note: this relies on React rendering being synchronous within a
// single tree. It is safe for non-concurrent render paths. If the app adopts
// React 18 concurrent features (startTransition, useDeferredValue) on paths
// that render cross-program widgets, revisit this mechanism.
const contextStack: Array<TerminologyContext> = [];

/**
 * Runs `fn` with `context` as the active program terminology context.
 * Any `i18n.t` calls made synchronously inside `fn` will use this context
 * instead of the global Redux-derived context.
 *
 * Use this in non-React code (hooks, data builders, column factories) where
 * you know the program that the translated strings are about — for example
 * when building column definitions for a cross-program relationship widget.
 */
export const withProgramTerminologyContext = <T>(
    context: TerminologyContext,
    fn: () => T,
): T => {
    contextStack.push(context);
    try {
        return fn();
    } finally {
        contextStack.pop();
    }
};

/** Returns the innermost explicit context, or undefined if none is active. */
export const getActiveProgramTerminologyContext = (): TerminologyContext | undefined => (
    contextStack.length > 0 ? contextStack[contextStack.length - 1] : undefined
);
