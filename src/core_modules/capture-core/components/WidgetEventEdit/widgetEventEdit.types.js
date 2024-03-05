// @flow

import type { ProgramStage } from '../../metaData';
import type { UserFormField } from '../FormFields/UserField';

export type Props = {|
    programStage: ProgramStage,
    eventStatus?: string,
    onGoBack: () => void,
    onCancelEditEvent: (isScheduled: boolean) => void,
    onHandleScheduleSave: (eventData: Object) =>void,
    onSaveExternal: () => void,
    orgUnitId: string,
    programId: string,
    enrollmentId: string,
    eventId: string,
    teiId: string,
    initialScheduleDate?: string,
    assignee?: UserFormField | null,
    onSaveAndCompleteEnrollment: (enrollment: ApiEnrollment) => void,
    onSaveAndCompleteEnrollmentSuccessActionType?: string,
    onSaveAndCompleteEnrollmentErrorActionType?: string,
|};

export type PlainProps = {|
    ...Props,
    ...CssClasses,
|}
