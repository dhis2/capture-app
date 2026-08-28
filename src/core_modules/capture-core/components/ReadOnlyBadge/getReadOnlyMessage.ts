import i18n from '@dhis2/d2-i18n';
import type { ReadOnlyMessageInput } from './ReadOnlyBadge.types';

const getEnrollmentMessage = (): string => i18n.t('You only have view access to this enrollment');

const getProgramMessage = (): string => i18n.t('You only have view access to this program');

const getTrackedEntityMessage = (trackedEntityName: string | undefined): string => (trackedEntityName
    ? i18n.t('You only have view access to this {{trackedEntityName}}', { trackedEntityName, escapeValue: false })
    : i18n.t('You only have view access to this tracked entity type'));

const getProgramStageMessage = (multipleStages: boolean): string => (multipleStages
    ? i18n.t('You only have view access to these program stages')
    : i18n.t('You only have view access to this program stage'));

const getExpiredMessage = (): string => i18n.t('This event is outside the editing period');

const getCompletedEventMessage = (): string => i18n.t('This event has been completed');

const getUncompleteAuthorityMessage = (): string => i18n.t('You do not have access to uncomplete this event');

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
}: ReadOnlyMessageInput): string => {
    if (trackedEntityInactive) return getDeactivatedMessage(trackedEntityName);
    if (!access.program && !access.trackedEntityType && !access.programStage) return getEnrollmentMessage();
    if (!access.program) return getProgramMessage();
    if (!access.trackedEntityType) return getTrackedEntityMessage(trackedEntityName);
    if (!access.programStage) return getProgramStageMessage(multipleStages);
    if (isEventBlockedByExpiry) return getExpiredMessage();
    if (isEventBlockedByCompletion) return getCompletedEventMessage();
    if (isEventCompleted && !canToggleCompletion) return getUncompleteAuthorityMessage();
    return '';
};
