// @flow
import type { ProgramStage } from '../../../metaData';
import type { WidgetEffects, HideWidgets } from '../common/EnrollmentOverviewDomain';
import type { UserFormField } from '../../FormFields/UserField';

export type PlainProps = {|
    programStage: ?ProgramStage,
    widgetEffects: WidgetEffects,
    hideWidgets: HideWidgets,
    teiId: string,
    enrollmentId: string,
    programId: string,
    mode: string,
    orgUnitId: string,
    trackedEntityName: string,
    teiDisplayName: string,
    eventDate?: string,
    scheduleDate?: string,
    enrollmentsAsOptions: Array<Object>,
    onDelete: () => void,
    onAddNew: () => void,
    onGoBack: () => void,
    onEnrollmentError: (message: string) => void,
    onEnrollmentSuccess: () => void,
    onCancelEditEvent: (isScheduled: boolean) => void,
    onHandleScheduleSave: (eventData: Object) => void,
    pageStatus: string,
    eventStatus?: string,
    eventAccess: {|
        read: boolean,
        write: boolean,
    |} | null,
    onGetAssignedUserSaveContext: () => { event: ApiEnrollmentEvent },
    assignee: UserFormField | null,
    onSaveAssignee: (newAssignee: UserFormField) => void,
    onSaveAssigneeError: (prevAssignee: UserFormField | null) => void,
    ...CssClasses,
|};

export type Props = {|
    programId: string,
    stageId: string,
    teiId: string,
    enrollmentId: string,
    orgUnitId: string,
    event: ApiEnrollmentEvent,
    enrollmentSite: ApiEnrollment,
    initMode?: string,
|};
