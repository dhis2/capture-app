import type { ProgramStage } from '../../../../../metaData';

export type PlainProps = {
    notes?: Array<any>;
    onAddNote: (note: string) => void;
    onUpdateNoteField: (value: string) => void;
    fieldValue?: string;
    ready: boolean;
    programStage: ProgramStage;
    eventAccess: any;
};
