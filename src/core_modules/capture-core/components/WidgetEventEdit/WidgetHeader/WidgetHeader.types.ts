import type { OrgUnit } from '@dhis2/rules-engine-javascript';
import { ProgramStage } from '../../../metaData';

export type PlainProps = {
    eventId: string,
    eventStatus?: string,
    stage: ProgramStage,
    programId: string,
    orgUnit: OrgUnit,
    teiId: string,
    enrollmentId: string,
    setChangeLogIsOpen: (toggle: boolean) => void,
    readOnly: boolean,
    canDeleteEvent: boolean,
    canUncompleteEvent: boolean,
    canEditProgramStage: boolean,
    readOnlyMessage: string,
};
