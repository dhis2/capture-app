export type NoteScope = 'enrollment' | 'event';

export type Props = {
    title: string;
    placeholder: string;
    emptyNoteMessage: string;
    scope: NoteScope;
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
