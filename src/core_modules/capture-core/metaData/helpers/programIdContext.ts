import { createContext } from 'react';

/**
 * Provides a fallback programId for routes whose URL doesn't carry one
 * (e.g. `/viewEvent`, `/enrollmentEventEdit`, or `/enrollment` before its URL is enriched).
 * `useTermLabel` reads URL first, then this context. Wrap the subtree in
 * `<ProgramIdContext.Provider value={programId}>` once the value is known.
 */
export const ProgramIdContext = createContext<string | null | undefined>(undefined);
