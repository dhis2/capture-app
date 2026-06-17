import React from 'react';
import { IconInfo16, Tag } from '@dhis2/ui';
import i18n from '@dhis2/d2-i18n';
import { withStyles, type WithStyles } from 'capture-core-utils/styles';
import { ConditionalTooltip } from '../Tooltips/ConditionalTooltip';
import { useProgramLabel, useStageLabel, useTrackedEntityTypeLabel } from '../../metaData';

const styles = {
    label: {
        fontWeight: 500,
    },
} as const;

type Props = {
    programWriteAccess?: boolean;
    trackedEntityTypeWriteAccess?: boolean;
    programStageWriteAccess?: boolean;
    eventWithinValidPeriod?: boolean;
    canEditCompletedEvent?: boolean;
    multipleStages?: boolean;
    trackedEntityName?: string;
    inlineLabel?: boolean;
};

type Access = {
    program: boolean;
    trackedEntityType: boolean;
    programStage: boolean;
};

const getEnrollmentMessage = (enrollment: string): string =>
    i18n.t('You only have view access to this {{enrollment}}', { enrollment, escapeValue: false });

const getProgramMessage = (): string => i18n.t('You only have view access to this program');

const getTrackedEntityMessage = (
    trackedEntityName: string | undefined,
    trackedEntityType: string,
): string => (trackedEntityName
    ? i18n.t('You only have view access to this {{trackedEntityName}}', { trackedEntityName, escapeValue: false })
    : i18n.t('You only have view access to this {{trackedEntityType}}', { trackedEntityType, escapeValue: false }));

const getProgramStageMessage = (multipleStages: boolean, programStage: string, programStages: string): string =>
    (multipleStages
        ? i18n.t('You only have view access to these {{programStages}}', { programStages, escapeValue: false })
        : i18n.t('You only have view access to this {{programStage}}', { programStage, escapeValue: false }));

const getExpiredPeriodMessage = (event: string): string =>
    i18n.t('This {{event}} is outside the valid editing period', { event, escapeValue: false });

const getCompletedEventMessage = (event: string): string =>
    i18n.t('This {{event}} has been completed', { event, escapeValue: false });

type Labels = {
    enrollment: string;
    trackedEntityType: string;
    programStage: string;
    programStages: string;
    event: string;
};

const getReadOnlyMessage = (
    access: Access,
    trackedEntityName: string | undefined,
    multipleStages: boolean,
    eventWithinValidPeriod: boolean,
    canEditCompletedEvent: boolean,
    labels: Labels,
): string => {
    if (!access.program && !access.trackedEntityType && !access.programStage) {
        return getEnrollmentMessage(labels.enrollment);
    }
    if (!access.program) return getProgramMessage();
    if (!access.trackedEntityType) return getTrackedEntityMessage(trackedEntityName, labels.trackedEntityType);
    if (!access.programStage) return getProgramStageMessage(multipleStages, labels.programStage, labels.programStages);
    if (!eventWithinValidPeriod) return getExpiredPeriodMessage(labels.event);
    if (!canEditCompletedEvent) return getCompletedEventMessage(labels.event);
    return '';
};

const ReadOnlyBadgePlain = ({
    programWriteAccess = true,
    trackedEntityTypeWriteAccess = true,
    programStageWriteAccess = true,
    eventWithinValidPeriod = true,
    canEditCompletedEvent = true,
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
    const labels: Labels = {
        enrollment: useProgramLabel('enrollment') ?? i18n.t('enrollment'),
        trackedEntityType: useTrackedEntityTypeLabel('trackedEntityType') ?? i18n.t('tracked entity type'),
        programStage: useStageLabel('programStage') ?? i18n.t('program stage'),
        programStages: useStageLabel('programStage', { plural: true }) ?? i18n.t('program stages'),
        event: useStageLabel('event') ?? i18n.t('event'),
    };
    const message = getReadOnlyMessage(
        access,
        trackedEntityName,
        multipleStages,
        eventWithinValidPeriod,
        canEditCompletedEvent,
        labels,
    );
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
