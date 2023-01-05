// @flow

import type { ProgramStage } from '../../metaData';

export type Props = {|
    programStage: ProgramStage,
    eventStatus?: string,
    onGoBack: () => void,
    onCancelEditEvent: () => void,
    onHandleScheduleSave: (eventData: Object) =>void,
    orgUnitId: string,
    programId: string,
    enrollmentId: string,
    teiId: string,
    initialScheduleDate?: string,
    ...CssClasses,
|};
