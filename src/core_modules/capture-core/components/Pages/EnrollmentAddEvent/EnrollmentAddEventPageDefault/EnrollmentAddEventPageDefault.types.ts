import type { HideWidgets, WidgetEffects } from '../../common/EnrollmentOverviewDomain';
import type { ExternalSaveHandler } from '../../../WidgetEnrollmentEventNew';
import type {
    PageLayoutConfig,
    WidgetConfig,
} from '../../common/EnrollmentOverviewDomain/EnrollmentPageLayout/DefaultEnrollmentLayout.types';
import { Program } from '../../../../metaData';
import type { ApiEnrollmentEvent } from '../../../../../capture-core-utils/types/api-types';

type CssClasses = {
    classes: {
        [key: string]: string;
    };
};

export type Props = {
    program: Program | null | undefined;
    stageId: string;
    orgUnitId: string;
    teiId: string;
    enrollmentId: string;
    onSave: ExternalSaveHandler;
    dataEntryHasChanges: boolean;
    userInteractionInProgress: boolean;
    onBackToMainPage: () => void;
    onBackToDashboard: () => void;
    onCancel: () => void;
    onDelete: () => void;
    onAddNew: () => void;
    onEnrollmentError: (message: string) => void;
    onAccessLostFromTransfer?: () => void;
    onEnrollmentSuccess: () => void;
    widgetEffects: WidgetEffects | null | undefined;
    hideWidgets: HideWidgets;
    rulesExecutionDependencies: Record<string, unknown>;
    pageFailure: boolean;
    ready: boolean;
    widgetReducerName: string;
    events?: Array<ApiEnrollmentEvent>;
    onUpdateEnrollmentStatus: (enrollment: Record<string, unknown>) => void;
    onUpdateEnrollmentStatusSuccess: (params: { redirect?: boolean }) => void;
    onUpdateEnrollmentStatusError: (message: string) => void;
    pageLayout: PageLayoutConfig;
    availableWidgets: Readonly<{ [key: string]: WidgetConfig }>;
    onDeleteTrackedEntitySuccess: () => void;
} & CssClasses;

export type ContainerProps = {
    pageLayout: PageLayoutConfig;
    enrollment?: Record<string, unknown> | null | undefined;
    attributeValues?: Record<string, unknown> | null | undefined;
    commonDataError: boolean;
};
