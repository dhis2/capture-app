// @flow
import { WidgetStagesAndEvents } from '../../../../../WidgetStagesAndEvents';
import type { Props as StagesAndEventProps } from '../../../../../WidgetStagesAndEvents/stagesAndEvents.types';
import { TrackedEntityRelationshipsWrapper } from '../../../TEIRelationshipsWidget/TrackedEntityRelationshipsWrapper';
import type { Props as TrackedEntityRelationshipProps } from '../../../TEIRelationshipsWidget/TrackedEntityRelationshipsWrapper/TrackedEntityRelationshipsWrapper.types';
import { WidgetError } from '../../../../../WidgetErrorAndWarning/WidgetError';
import type { Props as WidgetErrorProps } from '../../../../../WidgetErrorAndWarning/WidgetError/WidgetError.types';
import { EnrollmentQuickActions } from '../../../../Enrollment/EnrollmentPageDefault/EnrollmentQuickActions';
import { WidgetWarning } from '../../../../../WidgetErrorAndWarning/WidgetWarning';
import type { Props as WidgetWarningProps } from '../../../../../WidgetErrorAndWarning/WidgetWarning/WidgetWarning.types';
import { WidgetFeedback } from '../../../../../WidgetFeedback';
import { WidgetIndicator } from '../../../../../WidgetIndicator';
import { WidgetEnrollmentComment } from '../../../../../WidgetEnrollmentComment';
import { WidgetProfile } from '../../../../../WidgetProfile';
import type { Props as WidgetProfileProps } from '../../../../../WidgetProfile/widgetProfile.types';
import { WidgetEnrollment } from '../../../../../WidgetEnrollment';
import type { Props as WidgetEnrollmentProps } from '../../../../../WidgetEnrollment/enrollment.types';
import type { Props as NewEventWorkspaceWrapperProps } from '../../../../EnrollmentAddEvent/NewEventWorkspace/newEventWorkspace.types';
import type { Props as WidgetEventEditProps } from '../../../../../WidgetEventEdit/widgetEventEdit.types';
import type { WidgetConfig } from '../DefaultEnrollmentLayout.types';
import { NewEventWorkspaceWrapper } from '../../../NewEventWorkspaceWrapper';
import { WidgetEventEditWrapper } from '../../../WidgetEventEditWrapper';
import { WidgetEventComment } from '../../../../../WidgetEventComment';
import { WidgetAssignee } from '../../../../../WidgetAssignee';
import type {
    IndicatorProps,
    Props as WidgetFeedbackProps,
    InputFeedbackProps,
    InputIndicatorProps,
} from '../../../../../WidgetFeedback/WidgetFeedback.types';

export const QuickActions: WidgetConfig = {
    Component: EnrollmentQuickActions,
    getProps: ({ stages, events, ruleEffects }) => ({
        stages,
        events,
        ruleEffects,
    }),
};

export const StagesAndEvents: WidgetConfig = {
    Component: WidgetStagesAndEvents,
    getProps: ({
        program,
        stages,
        events,
        onViewAll,
        onCreateNew,
        onEventClick,
        ruleEffects,
    }): StagesAndEventProps => ({
        programId: program.id,
        stages,
        events,
        onViewAll,
        onCreateNew,
        onEventClick,
        ruleEffects,
    }),
};

export const TrackedEntityRelationship: WidgetConfig = {
    Component: TrackedEntityRelationshipsWrapper,
    shouldHideWidget: ({ addRelationShipContainerElement }) => !addRelationShipContainerElement,
    getProps: ({
        program,
        orgUnitId,
        addRelationShipContainerElement,
        toggleVisibility,
        teiId,
        onLinkedRecordClick,
    }): TrackedEntityRelationshipProps => ({
        trackedEntityTypeId: program.trackedEntityType.id,
        programId: program.id,
        orgUnitId,
        addRelationshipRenderElement: addRelationShipContainerElement,
        onOpenAddRelationship: toggleVisibility,
        onCloseAddRelationship: toggleVisibility,
        teiId,
        onLinkedRecordClick,
    }),
};

export const ErrorWidget: WidgetConfig = {
    Component: WidgetError,
    getProps: ({ widgetEffects }): WidgetErrorProps => ({
        error: widgetEffects?.errors,
    }),
};

export const WarningWidget: WidgetConfig = {
    Component: WidgetWarning,
    getProps: ({ widgetEffects }): WidgetWarningProps => ({
        warning: widgetEffects?.warnings,
    }),
};

export const FeedbackWidget: WidgetConfig = {
    Component: WidgetFeedback,
    shouldHideWidget: ({ hideWidgets }) => hideWidgets?.feedback,
    getProps: ({ widgetEffects, feedbackEmptyText }: InputFeedbackProps): WidgetFeedbackProps => ({
        feedback: widgetEffects?.feedbacks,
        emptyText: feedbackEmptyText,
    }),
};

export const IndicatorWidget: WidgetConfig = {
    Component: WidgetIndicator,
    shouldHideWidget: ({ hideWidgets }) => hideWidgets?.indicator,
    getProps: ({ widgetEffects, indicatorEmptyText }: InputIndicatorProps): IndicatorProps => ({
        indicators: widgetEffects?.indicators,
        emptyText: indicatorEmptyText,
    }),
};

export const EnrollmentComment: WidgetConfig = {
    Component: WidgetEnrollmentComment,
    getProps: (): void => {},
};

export const ProfileWidget: WidgetConfig = {
    Component: WidgetProfile,
    getCustomSettings: ({ readOnlyMode = true }) => ({
        readOnlyMode,
    }),
    getProps: ({
        teiId,
        program,
        orgUnitId,
        onUpdateTeiAttributeValues,
        onDeleteTrackedEntitySuccess,
    }): WidgetProfileProps => ({
        teiId,
        programId: program.id,
        orgUnitId,
        onUpdateTeiAttributeValues,
        onDeleteSuccess: onDeleteTrackedEntitySuccess,
    }),
};

export const NewEventWorkspace: WidgetConfig = {
    Component: NewEventWorkspaceWrapper,
    getProps: ({
        program,
        stageId,
        orgUnitId,
        teiId,
        enrollmentId,
        dataEntryHasChanges,
        widgetReducerName,
        rulesExecutionDependencies,
        onSave,
        onCancel,
    }): NewEventWorkspaceWrapperProps => ({
        programId: program.id,
        stageId,
        orgUnitId,
        teiId,
        enrollmentId,
        dataEntryHasChanges,
        widgetReducerName,
        rulesExecutionDependencies,
        onSave,
        onCancel,
    }),
};

export const EnrollmentWidget: WidgetConfig = {
    Component: WidgetEnrollment,
    shouldHideWidget: ({ enrollmentId }) => enrollmentId === 'AUTO',
    getCustomSettings: ({ readOnlyMode }) => ({
        readOnlyMode,
    }),
    getProps: ({
        teiId,
        enrollmentId,
        program,
        events,
        widgetEnrollmentStatus,
        onDelete,
        onAddNew,
        onUpdateEnrollmentDate,
        onUpdateIncidentDate,
        onUpdateEnrollmentStatus,
        onUpdateEnrollmentStatusSuccess,
        onUpdateEnrollmentStatusError,
        onEnrollmentError,
        onAccessLostFromTransfer,
    }): WidgetEnrollmentProps => ({
        teiId,
        enrollmentId,
        programId: program.id,
        onDelete,
        onAddNew,
        onUpdateEnrollmentDate,
        onUpdateIncidentDate,
        onUpdateEnrollmentStatus,
        onUpdateEnrollmentStatusSuccess,
        onUpdateEnrollmentStatusError,
        externalData: { status: widgetEnrollmentStatus, events },
        onError: onEnrollmentError,
        onAccessLostFromTransfer,
    }),
};

export const EditEventWorkspace: WidgetConfig = {
    Component: WidgetEventEditWrapper,
    getProps: ({
        programStage,
        onGoBack,
        program,
        orgUnitId,
        teiId,
        enrollmentId,
        eventId,
        eventStatus,
        onCancelEditEvent,
        onHandleScheduleSave,
        onSaveExternal,
        initialScheduleDate,
        assignee,
        onSaveAndCompleteEnrollment,
        onSaveAndCompleteEnrollmentErrorActionType,
        onSaveAndCompleteEnrollmentSuccessActionType,
    }): WidgetEventEditProps => ({
        programStage,
        onGoBack,
        programId: program.id,
        orgUnitId,
        teiId,
        enrollmentId,
        eventId,
        eventStatus,
        onCancelEditEvent,
        onHandleScheduleSave,
        onSaveExternal,
        initialScheduleDate,
        assignee,
        onSaveAndCompleteEnrollment,
        onSaveAndCompleteEnrollmentErrorActionType,
        onSaveAndCompleteEnrollmentSuccessActionType,
    }),
};

export const AssigneeWidget: WidgetConfig = {
    Component: WidgetAssignee,
    getProps: ({
        programStage,
        assignee,
        getAssignedUserSaveContext,
        eventAccess,
        onSaveAssignee,
        onSaveAssigneeError,
    }) => ({
        enabled: programStage?.enableUserAssignment || false,
        assignee,
        getSaveContext: getAssignedUserSaveContext,
        writeAccess: eventAccess?.write || false,
        onSave: onSaveAssignee,
        onSaveError: onSaveAssigneeError,
    }),
};

export const EventComment: WidgetConfig = {
    Component: WidgetEventComment,
    getProps: ({ dataEntryKey, dataEntryId }) => ({
        dataEntryKey,
        dataEntryId,
    }),
};
