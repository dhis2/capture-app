import i18n from '@dhis2/d2-i18n';
import type { ReadOnlyMessageInput } from './ReadOnlyBadge.types';

const getEnrollmentMessage = (enrollmentLabel: string): string =>
    i18n.t('You only have view access to this {{enrollmentLabel}}', { enrollmentLabel });

const getProgramMessage = (): string => i18n.t('You only have view access to this program');

const getTrackedEntityMessage = (trackedEntityName: string | undefined): string => (trackedEntityName
    ? i18n.t('You only have view access to this {{trackedEntityName}}', { trackedEntityName, escapeValue: false })
    : i18n.t('You only have view access to this tracked entity type'));

const getProgramStageMessage = (
    multipleStages: boolean,
    programStageLabel: string,
    programStagesLabel: string,
): string => (multipleStages
    ? i18n.t('You only have view access to these {{programStagesLabel}}', { programStagesLabel })
    : i18n.t('You only have view access to this {{programStageLabel}}', { programStageLabel }));

const getExpiredMessage = (eventLabel: string): string =>
    i18n.t('This {{eventLabel}} is outside the editing period', { eventLabel });

const getCompletedEventMessage = (eventLabel: string): string =>
    i18n.t('This {{eventLabel}} has been completed', { eventLabel });

const getUncompleteAuthorityMessage = (eventLabel: string): string =>
    i18n.t('You do not have access to uncomplete this {{eventLabel}}', { eventLabel });

const getDeactivatedMessage = (trackedEntityName: string | undefined): string => (trackedEntityName
    ? i18n.t('This {{trackedEntityName}} is deactivated', { trackedEntityName, escapeValue: false })
    : i18n.t('This tracked entity is deactivated'));

// eslint-disable-next-line complexity
export const getReadOnlyMessage = ({
    access,
    trackedEntityName,
    multipleStages,
    isEventBlockedByExpiry,
    isEventBlockedByCompletion,
    isEventCompleted,
    canToggleCompletion,
    trackedEntityInactive,
    enrollmentLabel,
    programStageLabel,
    programStagesLabel,
    eventLabel,
}: ReadOnlyMessageInput): string => {
    if (trackedEntityInactive) return getDeactivatedMessage(trackedEntityName);
    if (!access.program && !access.trackedEntityType && !access.programStage) return getEnrollmentMessage(enrollmentLabel);
    if (!access.program) return getProgramMessage();
    if (!access.trackedEntityType) return getTrackedEntityMessage(trackedEntityName);
    if (!access.programStage) return getProgramStageMessage(multipleStages, programStageLabel, programStagesLabel);
    if (isEventBlockedByExpiry) return getExpiredMessage(eventLabel);
    if (isEventBlockedByCompletion) return getCompletedEventMessage(eventLabel);
    if (isEventCompleted && !canToggleCompletion) return getUncompleteAuthorityMessage(eventLabel);
    return '';
};
