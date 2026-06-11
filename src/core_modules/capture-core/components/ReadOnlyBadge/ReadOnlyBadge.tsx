import React from 'react';
import { IconInfo16, Tag } from '@dhis2/ui';
import i18n from '@dhis2/d2-i18n';
import { withStyles, type WithStyles } from 'capture-core-utils/styles';
import { ConditionalTooltip } from '../Tooltips/ConditionalTooltip';
import type { Props, Access, ReadOnlyMessageInput } from './ReadOnlyBadge.types';

const styles = {
    label: {
        fontWeight: 500,
    },
} as const;

const getEnrollmentMessage = (): string => i18n.t('You only have view access to this enrollment');

const getProgramMessage = (): string => i18n.t('You only have view access to this program');

const getTrackedEntityMessage = (trackedEntityName: string | undefined): string => (trackedEntityName
    ? i18n.t('You only have view access to this {{trackedEntityName}}', { trackedEntityName, escapeValue: false })
    : i18n.t('You only have view access to this tracked entity type'));

const getProgramStageMessage = (multipleStages: boolean): string => (multipleStages
    ? i18n.t('You only have view access to these program stages')
    : i18n.t('You only have view access to this program stage'));

const getExpiredMessage = (): string => i18n.t('This event is outside the valid editing period');

const getCompletedEventMessage = (): string => i18n.t('This event has been completed');

const getReadOnlyMessage = ({
    access,
    trackedEntityName,
    multipleStages,
    eventWithinValidPeriod,
    canEditCompletedEvent,
    withinCompleteEventsExpiry,
}: ReadOnlyMessageInput): string => {
    if (!access.program && !access.trackedEntityType && !access.programStage) return getEnrollmentMessage();
    if (!access.program) return getProgramMessage();
    if (!access.trackedEntityType) return getTrackedEntityMessage(trackedEntityName);
    if (!access.programStage) return getProgramStageMessage(multipleStages);
    if (!eventWithinValidPeriod) return getExpiredMessage();
    if (!canEditCompletedEvent) return getCompletedEventMessage();
    if (!withinCompleteEventsExpiry) return getExpiredMessage();
    return '';
};

const ReadOnlyBadgePlain = ({
    programWriteAccess = true,
    trackedEntityTypeWriteAccess = true,
    programStageWriteAccess = true,
    eventWithinValidPeriod = true,
    canEditCompletedEvent = true,
    withinCompleteEventsExpiry = true,
    multipleStages = false,
    trackedEntityName,
    inlineLabel = false,
    classes,
}: Props & WithStyles<typeof styles>) => {
    const access: Access = {
        program: programWriteAccess,
        trackedEntityType: trackedEntityTypeWriteAccess,
        programStage: programStageWriteAccess,
    };
    const message = getReadOnlyMessage({
        access,
        trackedEntityName,
        multipleStages,
        eventWithinValidPeriod,
        canEditCompletedEvent,
        withinCompleteEventsExpiry,
    });
    if (!message) return null;

    const labelText = inlineLabel
        ? i18n.t('View only - {{message}}', { message, escapeValue: false })
        : i18n.t('View only');

    return (
        <ConditionalTooltip content={message} enabled>
            <Tag maxWidth="400px" neutral icon={<IconInfo16 />}>
                <span className={classes.label}>{labelText}</span>
            </Tag>
        </ConditionalTooltip>
    );
};

export const ReadOnlyBadge = withStyles(styles)(ReadOnlyBadgePlain);
