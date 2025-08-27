import { ProgramStage } from 'capture-core/metaData';

export type PlainProps = {
    showEditEvent?: boolean;
    eventId: string;
    eventData: any;
    onOpenEditEvent: (orgUnit: any, programCategory?: any) => void;
    programStage: ProgramStage;
    eventAccess: { read: boolean, write: boolean };
    programId: string;
    onBackToAllEvents: () => void;
};
