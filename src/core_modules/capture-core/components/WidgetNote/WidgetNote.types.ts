import { NoteType } from './NoteSection/NoteSection.js';

export type Props = {
    title: string;
    placeholder: string;
    emptyNoteMessage: string;
    notes: Array<NoteType>;
    onAddNote: (note: string) => void;
    classes?: {
        [key: string]: string | undefined;
    };
};
