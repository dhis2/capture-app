export type PlainProps = {
    notes?: Array<any>;
    onAddNote: (note: string, programId: string) => void;
    onUpdateNoteField: (value: string) => void;
    fieldValue?: string;
    ready: boolean;
    readOnly: boolean;
    programId: string;
};
