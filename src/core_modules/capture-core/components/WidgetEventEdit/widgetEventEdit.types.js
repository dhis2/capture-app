// @flow
import type { UserFormField } from '../FormFields/UserField';
import { ProgramStage, RenderFoundation } from '../../metaData';

export type Props = {|
    eventStatus?: string,
    onGoBack: () => void,
    onCancelEditEvent: (isScheduled: boolean) => void,
    onHandleScheduleSave: (eventData: Object) =>void,
    onSaveExternal: () => void,
    orgUnitId: string,
    programId: string,
    enrollmentId: string,
    eventId: string,
    stageId: string,
    teiId: string,
    initialScheduleDate?: string,
    assignee?: UserFormField | null,
    onSaveAndCompleteEnrollment: (enrollment: ApiEnrollment) => void,
    onSaveAndCompleteEnrollmentSuccessActionType?: string,
    onSaveAndCompleteEnrollmentErrorActionType?: string,
|};

export type ComponentProps = {|
    ...Props,
    formFoundation: RenderFoundation,
    stage: ProgramStage,
|};

export type PlainProps = {|
    ...ComponentProps,
    ...CssClasses,
|}
