import type { ProgramStage } from '../../../metaData';
import { Program } from '../../../metaData';
import type { HideWidgets, WidgetEffects } from '../common/EnrollmentOverviewDomain';
import type { UserFormField } from '../../FormFields/UserField';
import type { LinkedRecordClick } from '../../WidgetsRelationship/WidgetTrackedEntityRelationship';
import type {
    PageLayoutConfig,
} from '../common/EnrollmentOverviewDomain/EnrollmentPageLayout/DefaultEnrollmentLayout.types';

export type PlainProps = {
    pageLayout?: PageLayoutConfig | null;
    programStage?: ProgramStage | null;
    widgetEffects: WidgetEffects;
    hideWidgets: HideWidgets;
    teiId: string;
    enrollmentId: string;
    eventId: string;
    stageId: string;
    program?: Program | null;
    trackedEntityTypeId: string;
    mode: string;
    orgUnitId: string;
    trackedEntityName: string;
    teiDisplayName: string;
    eventDate?: string;
    scheduleDate?: string;
    enrollmentsAsOptions: Array<Record<string, unknown>>;
    onDelete: () => void;
    onAddNew: () => void;
    onNavigateToEvent: (eventId: string) => void;
    onBackToMainPage: () => void;
    onBackToDashboard: () => void;
    onBackToViewEvent: () => void;
    onLinkedRecordClick: LinkedRecordClick;
    onEnrollmentError: (message: string) => void;
    onEnrollmentSuccess: () => void;
    onUpdateEnrollmentStatus: (enrollment: Record<string, unknown>) => void;
    onUpdateEnrollmentStatusSuccess: (params: { redirect?: boolean }) => void;
    onUpdateEnrollmentStatusError: (message: string) => void;
    onSaveAndCompleteEnrollment: (enrollment: Record<string, unknown>) => void;
    onCancelEditEvent: (isScheduled: boolean) => void;
    onHandleScheduleSave: (eventData: Record<string, unknown>) => void;
    onSaveExternal: () => void;
    onAccessLostFromTransfer?: () => void;
    pageStatus: string;
    eventStatus?: string;
    eventAccess: {
        read: boolean;
        write: boolean;
    } | null;
    getAssignedUserSaveContext: () => { event: any };
    assignee: UserFormField | null;
    onSaveAssignee: (newAssignee: UserFormField) => void;
    onSaveAssigneeError: (prevAssignee: UserFormField | null) => void;
    onDeleteTrackedEntitySuccess: () => void;
    events: Array<any>;
    onDeleteEvent?: (eventId: string) => void;
    onDeleteEventRelationship?: (relationshipId: string) => void;
    onUpdateOrAddEnrollmentEvents: (events: Array<any>) => void;
    onUpdateEnrollmentEventsSuccess: (events: Array<any>) => void;
    onUpdateEnrollmentEventsError: (events: Array<any>) => void;
};

export type Props = {
    programId: string;
    stageId: string;
    teiId: string;
    enrollmentId: string;
    orgUnitId: string;
    event: any;
    enrollmentSite: any;
    initMode?: string;
};
