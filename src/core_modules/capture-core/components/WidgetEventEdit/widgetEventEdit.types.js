// @flow

import type { ProgramStage } from '../../metaData';

export type Props = {|
    programStage: ProgramStage,
    eventStatus?: string,
    onGoBack: () => void,
    onCancelEditEvent: () => void,
    orgUnitId: string,
    programId: string,
    enrollmentId: string,
    ...CssClasses,
|};
