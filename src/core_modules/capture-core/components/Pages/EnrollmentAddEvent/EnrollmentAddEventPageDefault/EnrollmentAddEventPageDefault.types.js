// @flow
import type { HideWidgets, WidgetEffects } from '../../common/EnrollmentOverviewDomain';
import type { ExternalSaveHandler } from '../../../WidgetEnrollmentEventNew';
import type {
    PageLayoutConfig,
    WidgetConfig,
} from '../../common/EnrollmentOverviewDomain/EnrollmentPageLayout/DefaultEnrollmentLayout.types';
import { Program } from '../../../../metaData';

export type Props = {|
    program: ?Program,
    stageId: string,
    orgUnitId: string,
    teiId: string,
    enrollmentId: string,
    onSave: ExternalSaveHandler,
    dataEntryHasChanges: boolean,
    userInteractionInProgress: boolean,
    trackedEntityName: string,
    onBackToMainPage: () => void,
    onBackToDashboard: () => void,
    onCancel: () => void,
    onDelete: () => void,
    onAddNew: () => void,
    onEnrollmentError: (message: string) => void,
    onAccessLostFromTransfer?: () => void,
    onEnrollmentSuccess: () => void,
    widgetEffects: ?WidgetEffects,
    hideWidgets: HideWidgets,
    rulesExecutionDependencies: Object,
    pageFailure: boolean,
    ready: boolean,
    widgetReducerName: string,
    events?: Array<ApiEnrollmentEvent>,
    onUpdateEnrollmentStatus: (enrollment: Object) => void,
    onUpdateEnrollmentStatusSuccess: ({ redirect?: boolean }) => void,
    onUpdateEnrollmentStatusError: (message: string) => void,
    pageLayout: PageLayoutConfig,
    availableWidgets: $ReadOnly<{ [key: string]: WidgetConfig }>,
    onDeleteTrackedEntitySuccess: () => void,
|};

export type ContainerProps = {|
    pageLayout: PageLayoutConfig,
    enrollment: ?Object,
    attributeValues: ?Object,
    commonDataError: boolean,
|}
