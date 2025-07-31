import type { ProgramStage } from '../../../../../metaData';

export type PlainProps = {
    classes: any;
    relationships?: Array<any> | null;
    onOpenAddRelationship: () => void;
    onDeleteRelationship: (clientId: string) => void;
    eventId: string;
    programStage: ProgramStage;
    ready: boolean;
    eventAccess: any;
    orgUnitId: string;
};
