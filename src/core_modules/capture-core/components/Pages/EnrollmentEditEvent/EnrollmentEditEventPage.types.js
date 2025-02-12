// @flow
import type { ProgramStage } from '../../../metaData';
import { Program } from '../../../metaData';
import type { HideWidgets, WidgetEffects } from '../common/EnrollmentOverviewDomain';
import type { UserFormField } from '../../FormFields/UserField';
import type { LinkedRecordClick } from '../../WidgetsRelationship/WidgetTrackedEntityRelationship';
import type {
    PageLayoutConfig,
} from '../common/EnrollmentOverviewDomain/EnrollmentPageLayout/DefaultEnrollmentLayout.types';

export type PlainProps = {|
    pageLayout: ?PageLayoutConfig,
    programStage: ?ProgramStage,
    widgetEffects: WidgetEffects,
    hideWidgets: HideWidgets,
    teiId: string,
    enrollmentId: string,
    eventId: string,
    stageId: string,
    program: ?Program,
    trackedEntityTypeId: string,
    mode: string,
    orgUnitId: string,
    trackedEntityName: string,
    teiDisplayName: string,
    eventDate?: string,
    scheduleDate?: string,
    enrollmentsAsOptions: Array<Object>,
    onDelete: () => void,
    onAddNew: () => void,
    onNavigateToEvent: (eventId: string) => void,
    onBackToMainPage: () => void,
    onBackToDashboard: () => void,
    onBackToViewEvent: () => void,
    onLinkedRecordClick: LinkedRecordClick,
    onEnrollmentError: (message: string) => void,
    onEnrollmentSuccess: () => void,
    onUpdateEnrollmentStatus: (enrollment: Object) => void,
    onUpdateEnrollmentStatusSuccess: ({ redirect?: boolean }) => void,
    onUpdateEnrollmentStatusError: (message: string) => void,
    onSaveAndCompleteEnrollment: (enrollment: Object) => void,
    onCancelEditEvent: (isScheduled: boolean) => void,
    onHandleScheduleSave: (eventData: Object) => void,
    onSaveExternal: () => void,
    onAccessLostFromTransfer?: () => void,
    pageStatus: string,
    eventStatus?: string,
    eventAccess: {|
        read: boolean,
        write: boolean,
    |} | null,
    getAssignedUserSaveContext: () => { event: ApiEnrollmentEvent },
    assignee: UserFormField | null,
    onSaveAssignee: (newAssignee: UserFormField) => void,
    onSaveAssigneeError: (prevAssignee: UserFormField | null) => void,
    onDeleteTrackedEntitySuccess: () => void,
    events: Array<any>,
    onDeleteEvent?: (eventId: string) => void,
    onDeleteEventRelationship?: (relationshipId: string) => void,
    onUpdateOrAddEnrollmentEvents: (events: Array<ApiEnrollmentEvent>) => void,
    onUpdateEnrollmentEventsSuccess: (events: Array<ApiEnrollmentEvent>) => void,
    onUpdateEnrollmentEventsError: (events: Array<ApiEnrollmentEvent>) => void,
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
