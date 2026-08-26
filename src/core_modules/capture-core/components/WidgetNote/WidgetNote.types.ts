import type { ReactNode } from 'react';

export type Props = {
    title: string;
    placeholder: string;
    emptyNoteMessage: string;
    readOnly: boolean;
    badge?: ReactNode;
    notes: Array<{
        value: string;
        storedAt: string;
        createdBy?: {
            firstName: string;
            surname: string;
        };
    }>;
    onAddNote: (note: string) => void;
};
