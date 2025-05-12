export type NoteType = {
    value: string;
    note?: string;
    storedAt: string;
    createdBy?: {
        firstName: string;
        surname: string;
    };
};

export type OwnProps = {
    notes: Array<NoteType>;
    handleAddNote: (text: string) => void;
    placeholder: string;
    emptyNoteMessage: string;
};
