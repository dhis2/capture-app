import React from 'react';
import { IconInfo16, Tag } from '@dhis2/ui';
import i18n from '@dhis2/d2-i18n';
import { ConditionalTooltip } from '../Tooltips/ConditionalTooltip';

type Props = {
    programWriteAccess?: boolean;
    trackedEntityTypeWriteAccess?: boolean;
    programStageWriteAccess?: boolean;
    multipleStages?: boolean;
    trackedEntityName?: string;
    inlineLabel?: boolean;
};

type Access = {
    program: boolean;
    trackedEntityType: boolean;
    programStage: boolean;
};

const getEnrollmentMessage = (): string => i18n.t('You only have view access to enrollment');

const getProgramMessage = (): string => i18n.t('You only have view access to program');

const getTrackedEntityMessage = (trackedEntityName: string | undefined): string => (trackedEntityName
    ? i18n.t('You only have view access to {{trackedEntityName}}', { trackedEntityName, escapeValue: false })
    : i18n.t('You only have view access to this tracked entity type'));

const getProgramStageMessage = (multipleStages: boolean): string => (multipleStages
    ? i18n.t('You only have view access to these program stages')
    : i18n.t('You only have view access to this program stage'));

const getMissingAccessMessage = (
    access: Access,
    trackedEntityName: string | undefined,
    multipleStages: boolean,
): string => {
    if (!access.program && !access.trackedEntityType && !access.programStage) return getEnrollmentMessage();
    if (!access.program) return getProgramMessage();
    if (!access.trackedEntityType) return getTrackedEntityMessage(trackedEntityName);
    if (!access.programStage) return getProgramStageMessage(multipleStages);
    return '';
};

export const ReadOnlyBadge = ({
    programWriteAccess = true,
    trackedEntityTypeWriteAccess = true,
    programStageWriteAccess = true,
    multipleStages = false,
    trackedEntityName,
    inlineLabel = false,
}: Props) => {
    if (programWriteAccess && trackedEntityTypeWriteAccess && programStageWriteAccess) return null;

    const access: Access = {
        program: programWriteAccess,
        trackedEntityType: trackedEntityTypeWriteAccess,
        programStage: programStageWriteAccess,
    };
    const message = getMissingAccessMessage(access, trackedEntityName, multipleStages);
    const labelText = inlineLabel && message ? `${i18n.t('View only')} - ${message}` : i18n.t('View only');

    return (
        <ConditionalTooltip content={message} enabled={Boolean(message)}>
            <Tag maxWidth="400px" neutral icon={<IconInfo16 />}>
                {labelText}
            </Tag>
        </ConditionalTooltip>
    );
};
