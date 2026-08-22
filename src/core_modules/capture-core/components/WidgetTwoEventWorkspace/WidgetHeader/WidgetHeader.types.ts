import { EnrollmentPageKeys }
    from '../../Pages/common/EnrollmentOverviewDomain/EnrollmentPageLayout/DefaultEnrollmentLayout.constants';
import type { ProgramStage } from '../../../metaData';

export type PlainProps = {
    orgUnitId: string;
    linkedEvent: { event: string };
    linkedStage: ProgramStage;
    currentPage: keyof typeof EnrollmentPageKeys | string;
    relationship: string;
    relationshipType: string;
    stage: ProgramStage;
    eventId: string;
    isOriginEventReadOnly: boolean;
    onDeleteEvent?: (eventId: string) => void;
    onDeleteEventRelationship?: (relationshipId: string) => void;
};
