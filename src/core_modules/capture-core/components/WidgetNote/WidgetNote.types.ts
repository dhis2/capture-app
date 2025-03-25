export type Props = {
    title: string;
    placeholder: string;
    emptyNoteMessage: string;
    notes: Array<Record<string, unknown>>;
    onAddNote: (note: string) => void;
    classes?: {
        [key: string]: string | undefined;
    };
};
