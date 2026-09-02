import React from 'react';
import { IconInfo16, Tag } from '@dhis2/ui';
import i18n from '@dhis2/d2-i18n';
import { withStyles, type WithStyles } from 'capture-core-utils/styles';
import { ConditionalTooltip } from '../Tooltips/ConditionalTooltip';
import type { Props, Access, ReadOnlyMessageInput } from './ReadOnlyBadge.types';
import { useTermLabel } from '../../metaData';
import { tCustomTerm } from '../../utils/tCustomTerm';

const styles = {
    label: {
        fontWeight: 500,
    },
} as const;

const getEnrollmentMessage = (enrollmentLabel: string): string =>
    tCustomTerm('You only have view access to this {{enrollmentLabel}}', { enrollmentLabel });

const getProgramMessage = (): string => i18n.t('You only have view access to this program');

const getTrackedEntityMessage = (trackedEntityName: string | undefined): string => (trackedEntityName
    ? i18n.t('You only have view access to this {{trackedEntityName}}', { trackedEntityName, escapeValue: false })
    : i18n.t('You only have view access to this tracked entity type'));

const getProgramStageMessage = (
    multipleStages: boolean,
    programStageLabel: string,
    programStagesLabel: string,
): string => (multipleStages
    ? tCustomTerm('You only have view access to these {{programStagesLabel}}', { programStagesLabel })
    : tCustomTerm('You only have view access to this {{programStageLabel}}', { programStageLabel }));

const getExpiredMessage = (eventLabel: string): string =>
    tCustomTerm('This {{eventLabel}} is outside the editing period', { eventLabel });

const getCompletedEventMessage = (eventLabel: string): string =>
    tCustomTerm('This {{eventLabel}} has been completed', { eventLabel });

const getDeactivatedMessage = (trackedEntityName: string | undefined): string => (trackedEntityName
    ? i18n.t('This {{trackedEntityName}} is deactivated', { trackedEntityName, escapeValue: false })
    : i18n.t('This tracked entity is deactivated'));

// eslint-disable-next-line complexity
const getReadOnlyMessage = ({
    access,
    trackedEntityName,
    multipleStages,
    eventWithinValidPeriod,
    canEditCompletedEvent,
    withinCompleteEventsExpiry,
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
    if (!eventWithinValidPeriod) return getExpiredMessage(eventLabel);
    if (!canEditCompletedEvent) return getCompletedEventMessage(eventLabel);
    if (!withinCompleteEventsExpiry) return getExpiredMessage(eventLabel);
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
    trackedEntityInactive = false,
    inlineLabel = false,
    stageId,
    classes,
}: Props & WithStyles<typeof styles>) => {
    const enrollmentLabel = useTermLabel('enrollment');
    const programStageLabel = useTermLabel('programStage', { stageId });
    const programStagesLabel = useTermLabel('programStage', { plural: true });
    const eventLabel = useTermLabel('event', { stageId });
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
        trackedEntityInactive,
        enrollmentLabel,
        programStageLabel,
        programStagesLabel,
        eventLabel,
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
