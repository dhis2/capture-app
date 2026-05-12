import { WidgetStagesAndEvents } from '../../../../../WidgetStagesAndEvents';
import type { Props as StagesAndEventProps } from '../../../../../WidgetStagesAndEvents/stagesAndEvents.types';
import { TrackedEntityRelationshipsWrapper } from '../../../TEIRelationshipsWidget/TrackedEntityRelationshipsWrapper';
import type { Props as TrackedEntityRelationshipProps } from
    '../../../TEIRelationshipsWidget/TrackedEntityRelationshipsWrapper/TrackedEntityRelationshipsWrapper.types';
import { WidgetError } from '../../../../../WidgetErrorAndWarning/WidgetError';
import type { Props as WidgetErrorProps } from '../../../../../WidgetErrorAndWarning/WidgetError/WidgetError.types';
import { EnrollmentQuickActions } from '../../../../Enrollment/EnrollmentPageDefault/EnrollmentQuickActions';
import { WidgetWarning } from '../../../../../WidgetErrorAndWarning/WidgetWarning';
import type { Props as WidgetWarningProps } from '../../../../../WidgetErrorAndWarning/WidgetWarning/WidgetWarning.types';
import { WidgetEnrollmentNote } from '../../../../../WidgetEnrollmentNote';
import { WidgetProfile } from '../../../../../WidgetProfile';
import type { Props as WidgetProfileProps } from '../../../../../WidgetProfile/widgetProfile.types';
import { WidgetEnrollment } from '../../../../../WidgetEnrollment';
import type { Props as WidgetEnrollmentProps } from '../../../../../WidgetEnrollment/enrollment.types';
import type { Props as NewEventWorkspaceWrapperProps } from
    '../../../../EnrollmentAddEvent/NewEventWorkspace/newEventWorkspace.types';
import type { Props as WidgetEventEditProps } from '../../../../../WidgetEventEdit/widgetEventEdit.types';
import type { WidgetConfig } from '../DefaultEnrollmentLayout.types';
import { NewEventWorkspaceWrapper } from '../../../NewEventWorkspaceWrapper';
import { WidgetEventEditWrapper } from '../../../WidgetEventEditWrapper';
import { WidgetEventNote } from '../../../../../WidgetEventNote';
import { WidgetAssignee } from '../../../../../WidgetAssignee';
import {
    WidgetFeedback,
    type FeedbackProps,
    type FeedbackInputProps,
} from '../../../../../WidgetFeedback';
import {
    WidgetIndicator,
    type IndicatorProps,
    type IndicatorInputProps,
} from '../../../../../WidgetIndicator';
import { WidgetTwoEventWorkspace } from '../../../../../WidgetTwoEventWorkspace';
import { WidgetRelatedStages } from '../../../../../WidgetRelatedStages';
import {
    EnrollmentPageKeys,
} from '../DefaultEnrollmentLayout.constants';

export const QuickActions: WidgetConfig = {
    Component: EnrollmentQuickActions,
    getProps: ({ stages, events, ruleEffects }: any) => ({
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
        onDeleteEvent,
        onUpdateEventStatus,
        onRollbackDeleteEvent,
        onEventClick,
        ruleEffects,
    }: any): StagesAndEventProps => ({
        programId: program.id,
        stages,
        events,
        onViewAll,
        onCreateNew,
        onDeleteEvent,
        onUpdateEventStatus,
        onRollbackDeleteEvent,
        onEventClick,
        ruleEffects,
    }),
};

export const TrackedEntityRelationship: WidgetConfig = {
    Component: TrackedEntityRelationshipsWrapper,
    shouldHideWidget: ({ addRelationShipContainerElement }: any) => !addRelationShipContainerElement,
    getProps: ({
        program,
        orgUnitId,
        addRelationShipContainerElement,
        toggleVisibility,
        teiId,
        onLinkedRecordClick,
    }: any): TrackedEntityRelationshipProps => ({
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
    getProps: ({ widgetEffects }: any): WidgetErrorProps => ({
        error: widgetEffects?.errors,
    }),
};

export const WarningWidget: WidgetConfig = {
    Component: WidgetWarning,
    getProps: ({ widgetEffects }: any): WidgetWarningProps => ({
        warning: widgetEffects?.warnings,
    }),
};

export const FeedbackWidget: WidgetConfig = {
    Component: WidgetFeedback,
    shouldHideWidget: ({ hideWidgets }: any) => hideWidgets?.feedback,
    getProps: ({ widgetEffects, feedbackEmptyText }: FeedbackInputProps): FeedbackProps => ({
        feedback: widgetEffects?.feedbacks as any,
        feedbackEmptyText,
    }),
};

export const IndicatorWidget: WidgetConfig = {
    Component: WidgetIndicator,
    shouldHideWidget: ({ hideWidgets }: any) => hideWidgets?.indicator,
    getProps: ({ widgetEffects, indicatorEmptyText }: IndicatorInputProps): IndicatorProps => ({
        indicators: widgetEffects?.indicators as any,
        indicatorEmptyText,
    }),
};

export const EnrollmentNote: WidgetConfig = {
    Component: WidgetEnrollmentNote,
    getProps: () => ({}),
};

export const ProfileWidget: WidgetConfig = {
    Component: WidgetProfile,
    getCustomSettings: ({ readOnlyMode = true }: any) => ({
        readOnlyMode,
    }),
    getProps: ({
        teiId,
        program,
        orgUnitId,
        onUpdateTeiAttributeValues,
        onDeleteTrackedEntitySuccess,
    }: any): WidgetProfileProps => ({
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
    }: any): NewEventWorkspaceWrapperProps => ({
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
    shouldHideWidget: ({ enrollmentId }: any) => enrollmentId === 'AUTO',
    getCustomSettings: ({ readOnlyMode }: any) => ({
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
    }: any): WidgetEnrollmentProps => ({
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
        program,
        orgUnitId,
        teiId,
        enrollmentId,
        eventId,
        stageId,
        eventStatus,
        onCancelEditEvent,
        onHandleScheduleSave,
        onSaveExternal,
        initialScheduleDate,
        assignee,
        onSaveAndCompleteEnrollment,
        onSaveAndCompleteEnrollmentErrorActionType,
        onSaveAndCompleteEnrollmentSuccessActionType,
        onDeleteEvent,
        onDeleteEventRelationship,
    }: any): WidgetEventEditProps => ({
        programId: program.id,
        stageId,
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
        onDeleteEvent,
        onDeleteEventRelationship,
    }),
};

export const TwoEventWorkspace: WidgetConfig = {
    Component: WidgetTwoEventWorkspace,
    getProps: ({ currentPage, eventId, program, stageId, orgUnitId }: any) => ({
        currentPage,
        eventId,
        programId: program.id,
        orgUnitId,
        stageId,
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
    }: any) => ({
        enabled: programStage?.enableUserAssignment || false,
        assignee,
        getSaveContext: getAssignedUserSaveContext,
        writeAccess: eventAccess?.write || false,
        onSave: onSaveAssignee,
        onSaveError: onSaveAssigneeError,
    }),
};

export const EventNote: WidgetConfig = {
    Component: WidgetEventNote,
    getProps: ({ dataEntryKey, dataEntryId }: any) => ({
        dataEntryKey,
        dataEntryId,
    }),
};

export const RelatedStagesWorkspace: WidgetConfig = {
    Component: WidgetRelatedStages,
    shouldHideWidget: ({ currentPage }: any) => currentPage === EnrollmentPageKeys.EDIT_EVENT,
    getProps: ({
        program,
        stageId,
        enrollmentId,
        eventId,
        teiId,
        onUpdateOrAddEnrollmentEvents,
        onUpdateEnrollmentEventsSuccess,
        onUpdateEnrollmentEventsError,
        onNavigateToEvent,
    }: any) => ({
        programId: program.id,
        programStageId: stageId,
        enrollmentId,
        eventId,
        teiId,
        onUpdateOrAddEnrollmentEvents,
        onUpdateEnrollmentEventsSuccess,
        onUpdateEnrollmentEventsError,
        onNavigateToEvent,
    }),
};
