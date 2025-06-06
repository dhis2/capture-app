// @flow
import { typeof effectActions } from '@dhis2/rules-engine-javascript';
import type { TrackerProgram } from 'capture-core/metaData';
import type { Stage } from 'capture-core/components/WidgetStagesAndEvents/types/common.types';
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

export type Props = {|
    currentPage: $Values<typeof EnrollmentPageKeys>,
    program: TrackerProgram,
    enrollmentId: string,
    teiId: string,
    events: ?Array<Event>,
    stages?: Array<Stage>,
    widgetEffects: ?WidgetEffects,
    hideWidgets: HideWidgets,
    orgUnitId: string,
    onBackToMainPage: () => void,
    onBackToDashboard?: () => void,
    onBackToViewEvent?: () => void,
    userInteractionInProgress?: boolean,
    eventStatus?: string,
    onDelete: () => void,
    onAddNew: () =>void,
    onViewAll: (stageId: string) => void,
    onCreateNew: (stageId: string) => void,
    onEventClick: (eventId: string) => void,
    onUpdateTeiAttributeValues: (attributes: Array<{ [key: string]: string }>, teiDisplayName: string) => void,
    onLinkedRecordClick: LinkedRecordClick,
    onUpdateEnrollmentDate: (enrollmentDate: string) => void,
    onUpdateIncidentDate: (incidentDate: string) => void,
    onAccessLostFromTransfer: () => void,
    onEnrollmentError: (message: string) => void,
    onUpdateEnrollmentStatus: (enrollment: Object) => void,
    onUpdateEnrollmentStatusSuccess: ({ redirect?: boolean }) => void,
    onUpdateEnrollmentStatusError: (message: string) => void,
    ruleEffects?: Array<{id: string, type: $Values<effectActions>}>;
    widgetEnrollmentStatus: ?string,
    pageLayout: PageLayoutConfig,
    availableWidgets: $ReadOnly<{ [key: string]: WidgetConfig }>,
    onDeleteTrackedEntitySuccess: () => void,
|};

export type PlainProps = {|
    ...Props,
    ...CssClasses,
|};

type DataElement = $ReadOnly<{|
    id: string,
    valueType: string,
    displayName: string,
    displayFormName: string,
    optionSet: $ReadOnly<{ options: ?$ReadOnlyArray<{name: string, code: string}> }>,
|}>;

type ProgramStageDataElement = $ReadOnly<{|
    displayInReports: boolean,
    dataElement: DataElement,
|}>;

type ProgramStage = $ReadOnly<{|
    id: string,
    dataAccess: { read: boolean, write: boolean },
    repeatable: boolean,
    hideDueDate: ?boolean,
    enableUserAssignment: ?boolean,
    programStageDataElements: $ReadOnlyArray<ProgramStageDataElement>,
|}>;

export type ProgramStages = $ReadOnlyArray<ProgramStage>;

export type Program = {|
    programStages: ProgramStages,
|};
