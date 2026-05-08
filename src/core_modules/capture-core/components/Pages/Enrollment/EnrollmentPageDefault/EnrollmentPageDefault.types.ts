import { effectActions } from '@dhis2/rules-engine-javascript';
import type { TrackerProgram } from 'capture-core/metaData';
import type { HideWidgets, WidgetEffects } from '../../common/EnrollmentOverviewDomain';
import type { Event } from '../../common/EnrollmentOverviewDomain/useCommonEnrollmentDomainData';
import type { LinkedRecordClick } from '../../../WidgetsRelationship/WidgetTrackedEntityRelationship';
import type {
    PageLayoutConfig,
    WidgetConfig,
} from '../../common/EnrollmentOverviewDomain/EnrollmentPageLayout/DefaultEnrollmentLayout.types';
import {
    EnrollmentPageKeys,
} from '../../common/EnrollmentOverviewDomain/EnrollmentPageLayout/DefaultEnrollmentLayout.constants';
import { EventStatuses } from '../../../Breadcrumbs/EnrollmentBreadcrumb/EnrollmentBreadcrumb';

type EnrollmentPageKeyTypes = typeof EnrollmentPageKeys[keyof typeof EnrollmentPageKeys];
type EventStatus = typeof EventStatuses[keyof typeof EventStatuses];

export type Props = {
    currentPage: EnrollmentPageKeyTypes;
    program: TrackerProgram;
    enrollmentId: string;
    teiId: string;
    events?: Array<Event> | null;
    stages?: Array<any>;
    widgetEffects?: WidgetEffects | null;
    hideWidgets: HideWidgets;
    orgUnitId: string;
    onBackToMainPage: () => void;
    onBackToDashboard?: () => void;
    onBackToViewEvent?: () => void;
    userInteractionInProgress?: boolean;
    eventStatus?: EventStatus;
    onDelete: () => void;
    onAddNew: () => void;
    onViewAll: (stageId: string) => void;
    onCreateNew: (stageId: string) => void;
    onEventClick: (eventId: string) => void;
    onUpdateTeiAttributeValues: (attributes: Array<{ [key: string]: string }>, teiDisplayName: string) => void;
    onLinkedRecordClick: LinkedRecordClick;
    onUpdateEnrollmentDate: (enrollmentDate: string) => void;
    onUpdateIncidentDate: (incidentDate: string) => void;
    onAccessLostFromTransfer: () => void;
    onEnrollmentError: (message: string) => void;
    onUpdateEnrollmentStatus: (enrollment: any) => void;
    onUpdateEnrollmentStatusSuccess: (params?: { redirect?: boolean }) => void;
    onUpdateEnrollmentStatusError: (message: string) => void;
    ruleEffects?: Array<{id: string; type: keyof typeof effectActions}>;
    widgetEnrollmentStatus?: string | null;
    pageLayout: PageLayoutConfig;
    availableWidgets: Readonly<{ [key: string]: WidgetConfig }>;
    onDeleteTrackedEntitySuccess: () => void;
};


type DataElement = Readonly<{
    id: string;
    valueType: string;
    displayName: string;
    displayFormName: string;
    optionSet: Readonly<{ options?: ReadonlyArray<{name: string; code: string}> | null }>;
}>;

type ProgramStageDataElement = Readonly<{
    displayInReports: boolean;
    dataElement: DataElement;
}>;

type ProgramStage = Readonly<{
    id: string;
    dataAccess: { read: boolean; write: boolean };
    repeatable: boolean;
    hideDueDate?: boolean | null;
    enableUserAssignment?: boolean | null;
    programStageDataElements: ReadonlyArray<ProgramStageDataElement>;
}>;

export type ProgramStages = ReadonlyArray<ProgramStage>;

export type Program = {
    programStages: ProgramStages;
};
