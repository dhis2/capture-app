export type NoteType = {
    value: string;
    storedAt: string;
    createdBy?: {
        firstName: string;
        surname: string;
    };
};

export type NoteSectionProps = {
    notes: Array<NoteType>;
    handleAddNote: (text: string) => void;
    placeholder: string;
    emptyNoteMessage: string;
    classes?: Record<string, string>;
};

export type Props = {
    title: string;
    placeholder: string;
    emptyNoteMessage: string;
    notes: Array<NoteType>;
    onAddNote: (note: string) => void;
};
