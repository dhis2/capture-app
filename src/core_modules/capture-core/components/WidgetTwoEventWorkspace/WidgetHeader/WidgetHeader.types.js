// @flow
import { EnrollmentPageKeys }
    from '../../Pages/common/EnrollmentOverviewDomain/EnrollmentPageLayout/DefaultEnrollmentLayout.constants';
import type { ProgramStage } from '../../../metaData';

export type PlainProps = {|
    orgUnitId: string,
    linkedEvent: { event: string },
    linkedStage: ProgramStage,
    currentPage: $Values<typeof EnrollmentPageKeys> | string,
    eventId: string,
    relationship: string,
    relationshipType: string,
    stage: ProgramStage,
|};

export type Props = {|
    ...PlainProps,
    ...CssClasses,
|};

