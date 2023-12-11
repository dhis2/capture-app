// @flow
import i18n from '@dhis2/d2-i18n';
import { WidgetStagesAndEvents } from '../../../../../WidgetStagesAndEvents';
import type { Props as StagesAndEventProps } from '../../../../../WidgetStagesAndEvents/stagesAndEvents.types';
import { TrackedEntityRelationshipsWrapper } from '../../../TEIRelationshipsWidget/TrackedEntityRelationshipsWrapper';
import type {
    Props as TrackedEntityRelationshipProps,
} from '../../../TEIRelationshipsWidget/TrackedEntityRelationshipsWrapper/TrackedEntityRelationshipsWrapper.types';
import { WidgetError } from '../../../../../WidgetErrorAndWarning/WidgetError';
import type { Props as WidgetErrorProps } from '../../../../../WidgetErrorAndWarning/WidgetError/WidgetError.types';
import { EnrollmentQuickActions } from '../../../../Enrollment/EnrollmentPageDefault/EnrollmentQuickActions';
import { WidgetWarning } from '../../../../../WidgetErrorAndWarning/WidgetWarning';
import type {
    Props as WidgetWarningProps,
} from '../../../../../WidgetErrorAndWarning/WidgetWarning/WidgetWarning.types';
import { WidgetFeedback } from '../../../../../WidgetFeedback';
import type { IndicatorProps, Props as WidgetFeedbackProps } from '../../../../../WidgetFeedback/WidgetFeedback.types';
import { WidgetIndicator } from '../../../../../WidgetIndicator';
import { WidgetEnrollmentComment } from '../../../../../WidgetEnrollmentComment';
import { WidgetProfile } from '../../../../../WidgetProfile';
import type { Props as WidgetProfileProps } from '../../../../../WidgetProfile/widgetProfile.types';
import { WidgetEnrollment } from '../../../../../WidgetEnrollment';
import type { Props as WidgetEnrollmentProps } from '../../../../../WidgetEnrollment/enrollment.types';
import type { WidgetConfig } from '../DefaultEnrollmentLayout.types';

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
    getProps: ({ program, stages, events, onViewAll, onCreateNew, onEventClick, ruleEffects }): StagesAndEventProps => ({
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
    getProps: ({ widgetEffects }): WidgetFeedbackProps => ({
        feedback: widgetEffects?.feedbacks,
        emptyText: i18n.t('No feedback for this enrollment yet'),
    }),
};

export const IndicatorWidget: WidgetConfig = {
    Component: WidgetIndicator,
    shouldHideWidget: ({ hideWidgets }) => hideWidgets?.indicator,
    getProps: ({ widgetEffects }): IndicatorProps => ({
        indicators: widgetEffects?.indicators,
        emptyText: i18n.t('No indicator output for this enrollment yet'),
    }),
};

export const Notes: WidgetConfig = {
    Component: WidgetEnrollmentComment,
    getProps: (): void => {},
};

export const ProfileWidget: WidgetConfig = {
    Component: WidgetProfile,
    getProps: ({
        teiId,
        program,
        orgUnitId,
        onUpdateTeiAttributeValues,
        showEditProfileWidget = true,
    }): WidgetProfileProps => ({
        teiId,
        programId: program.id,
        orgUnitId,
        onUpdateTeiAttributeValues,
        showEdit: showEditProfileWidget,
    }),
};

export const EnrollmentWidget: WidgetConfig = {
    Component: WidgetEnrollment,
    shouldHideWidget: ({ enrollmentId }) => enrollmentId === 'AUTO',
    getProps: ({ teiId, enrollmentId, program, onDelete, onAddNew, onUpdateEnrollmentDate, onUpdateIncidentDate, onEnrollmentError }): WidgetEnrollmentProps => ({
        teiId,
        enrollmentId,
        programId: program.id,
        onDelete,
        onAddNew,
        onUpdateEnrollmentDate,
        onUpdateIncidentDate,
        onError: onEnrollmentError,
    }),
};
