import { createContext } from 'react';

// Carries the programId that `useTermLabel` should scope custom-label lookups to
// on routes whose URL doesn't include one (e.g. enrollment/view-event pages).
export const CustomLabelsContext = createContext<string | null | undefined>(undefined);
