// @flow

import type { ProgramStage } from '../../metaData';
import type { UserFormField } from '../FormFields/UserField';

export type Props = {|
    programStage: ProgramStage,
    eventStatus?: string,
    onGoBack: () => void,
    onCancelEditEvent: (isScheduled: boolean) => void,
    onHandleScheduleSave: (eventData: Object) =>void,
    orgUnitId: string,
    programId: string,
    enrollmentId: string,
    teiId: string,
    initialScheduleDate?: string,
    assignee?: UserFormField | null,
    onSaveAndCompleteEnrollmentExternal?: (enrollment: ApiEnrollment) => void,
    onSaveAndCompleteEnrollmentSuccessActionType?: string,
    onSaveAndCompleteEnrollmentErrorActionType?: string,
    ...CssClasses,
|};
