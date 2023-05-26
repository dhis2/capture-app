// @flow
import type { Icon } from '../../../../metaData';

export type Props = {|
    programId: string,
    orgUnitId?: string,
    enrollmentId: string,
    teiDisplayName?: string,
    trackedEntityName?: string,
    stageName?: string,
    stageIcon?: Icon,
    eventDateLabel?: string,
    enrollmentsAsOptions?: Array<Object>,
    onSetOrgUnitId: (orgUnitId: string) => void,
    onResetOrgUnitId: () => void,
    onResetProgramId: () => void,
    onResetTeiId: () => void,
    onResetEnrollmentId: () => void,
    onResetStageId: () => void,
    onResetEventId: () => void,
    teiSelectorFailure: boolean,
    enrollmentSelectorFailure: boolean,
    userInteractionInProgress: boolean,
|};
