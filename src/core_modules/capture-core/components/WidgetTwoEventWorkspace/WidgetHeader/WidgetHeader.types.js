// @flow
import { EnrollmentPageKeys }
    from '../../Pages/common/EnrollmentOverviewDomain/EnrollmentPageLayout/DefaultEnrollmentLayout.constants';
import type { ProgramStage } from '../../../metaData';

export type PlainProps = {|
    orgUnitId: string,
    linkedEvent: { event: string },
    linkedStage: ProgramStage,
    currentPage: $Values<typeof EnrollmentPageKeys> | string,
    relationship: string,
    relationshipType: string,
    stage: ProgramStage,
    eventId: string,
    onDeleteEvent?: (eventId: string) => void,
    onDeleteEventRelationship?: (relationshipId: string) => void,
|};

export type Props = {|
    ...PlainProps,
    ...CssClasses,
|};
