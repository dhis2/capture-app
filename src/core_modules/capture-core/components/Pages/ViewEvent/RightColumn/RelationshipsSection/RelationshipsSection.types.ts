import type { ProgramStage } from '../../../../../metaData';

export type PlainProps = {
    relationships?: Array<any>;
    onOpenAddRelationship: () => void;
    onDeleteRelationship: (clientId: string) => void;
    eventId: string;
    programStage: ProgramStage;
    ready: boolean;
    readOnly: boolean;
    orgUnitId: string;
};
