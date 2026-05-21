export type PlainProps = {
    notes?: Array<any>;
    onAddNote: (note: string) => void;
    onUpdateNoteField: (value: string) => void;
    fieldValue?: string;
    ready: boolean;
    readOnly: boolean;
};
