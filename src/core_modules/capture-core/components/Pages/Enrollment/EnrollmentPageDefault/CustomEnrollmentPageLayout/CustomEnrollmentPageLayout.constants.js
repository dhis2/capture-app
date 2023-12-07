// @flow
import i18n from '@dhis2/d2-i18n';
import type { WidgetConfig } from './CustomEnrollmentPageLayout.types';

// import components
import { EnrollmentQuickActions } from '../EnrollmentQuickActions';
import { WidgetStagesAndEvents } from '../../../../WidgetStagesAndEvents';
import {
    TrackedEntityRelationshipsWrapper,
} from '../../../common/TEIRelationshipsWidget/TrackedEntityRelationshipsWrapper';
import { WidgetError } from '../../../../WidgetErrorAndWarning/WidgetError';
import { WidgetWarning } from '../../../../WidgetErrorAndWarning/WidgetWarning';
import { WidgetFeedback } from '../../../../WidgetFeedback';
import { WidgetIndicator } from '../../../../WidgetIndicator';
import { WidgetProfile } from '../../../../WidgetProfile';
import { WidgetEnrollment } from '../../../../WidgetEnrollment';
import { WidgetEnrollmentComment } from '../../../../WidgetEnrollmentComment';

// import PropTypes for components
import type { Props as ComponentProps } from '../EnrollmentPageDefault.types';
import type { Props as StagesAndEventProps } from '../../../../WidgetStagesAndEvents/stagesAndEvents.types';
import type {
    Props as TrackedEntityRelationshipProps,
} from '../../../common/TEIRelationshipsWidget/TrackedEntityRelationshipsWrapper/TrackedEntityRelationshipsWrapper.types';
import type { Props as WidgetErrorProps } from '../../../../WidgetErrorAndWarning/WidgetError/WidgetError.types';
import type { Props as WidgetWarningProps } from '../../../../WidgetErrorAndWarning/WidgetWarning/WidgetWarning.types';
import type {
    IndicatorProps,
    Props as WidgetFeedbackProps,
} from '../../../../WidgetFeedback/WidgetFeedback.types';
import type { Props as WidgetProfileProps } from '../../../../WidgetProfile/widgetProfile.types';
import type { Props as WidgetEnrollmentProps } from '../../../../WidgetEnrollment/enrollment.types';

export const WidgetsForCustomLayout: $ReadOnly<{ [key: string]: WidgetConfig }> = Object.freeze({
    QuickActions: {
        Component: EnrollmentQuickActions,
        getProps: ({ stages, events, ruleEffects }: ComponentProps) => ({
            stages,
            events,
            ruleEffects,
        }),
    },
    StagesAndEvents: {
        Component: WidgetStagesAndEvents,
        getProps: ({ program, stages, events, onViewAll, onCreateNew, onEventClick, ruleEffects }: ComponentProps): StagesAndEventProps => ({
            programId: program.id,
            stages,
            events,
            onViewAll,
            onCreateNew,
            onEventClick,
            ruleEffects,
        }),
    },
    TrackedEntityRelationship: {
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
    },
    ErrorWidget: {
        Component: WidgetError,
        getProps: ({ widgetEffects }): WidgetErrorProps => ({
            error: widgetEffects?.errors,
        }),
    },
    WarningWidget: {
        Component: WidgetWarning,
        getProps: ({ widgetEffects }): WidgetWarningProps => ({
            warning: widgetEffects?.warnings,
        }),
    },
    FeedbackWidget: {
        Component: WidgetFeedback,
        shouldHideWidget: ({ hideWidgets }) => hideWidgets?.feedback,
        getProps: ({ widgetEffects }): WidgetFeedbackProps => ({
            feedback: widgetEffects?.feedbacks,
            emptyText: i18n.t('No feedback for this enrollment yet'),
        }),
    },
    IndicatorWidget: {
        Component: WidgetIndicator,
        shouldHideWidget: ({ hideWidgets }) => hideWidgets?.indicator,
        getProps: ({ widgetEffects }): IndicatorProps => ({
            indicators: widgetEffects?.indicators,
            emptyText: i18n.t('No indicator output for this enrollment yet'),
        }),
    },
    Notes: {
        Component: WidgetEnrollmentComment,
        getProps: (): void => {},
    },
    ProfileWidget: {
        Component: WidgetProfile,
        getProps: ({ teiId, program, orgUnitId, onUpdateTeiAttributeValues, showEdit }): WidgetProfileProps => ({
            teiId,
            programId: program.id,
            orgUnitId,
            onUpdateTeiAttributeValues,
            showEdit,
        }),
    },
    EnrollmentWidget: {
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
    },
});
