import React from 'react';
import { colors, IconInfo16, Tag } from '@dhis2/ui';
import i18n from '@dhis2/d2-i18n';
import { ConditionalTooltip } from '../Tooltips/ConditionalTooltip';

type Props = {
    readOnly?: boolean;
    programWriteAccess?: boolean;
    trackedEntityTypeWriteAccess?: boolean;
    programStageWriteAccess?: boolean;
    trackedEntityName?: string;
    label?: string;
};

const interpolate = (key: string, trackedEntityName: string) =>
    i18n.t(key, { trackedEntityName, interpolation: { escapeValue: false } });

const getMultiMissingLabel = (
    missingProgram: boolean,
    missingTET: boolean,
    missingStage: boolean,
    trackedEntityName: string,
): string | null => {
    const parts: Array<string> = [];
    if (missingProgram) parts.push(i18n.t('program'));
    if (missingTET) parts.push(trackedEntityName);
    if (missingStage) parts.push(i18n.t('this program stage'));
    if (parts.length < 2) return null;
    const last = parts.pop() as string;
    const joined = `${parts.join(', ')} ${i18n.t('and')} ${last}`;
    return i18n.t('You only have view access to {{targets}}', {
        targets: joined,
        interpolation: { escapeValue: false },
    });
};

const getSingleMissingLabel = (
    missingProgram: boolean,
    missingTET: boolean,
    missingStage: boolean,
    trackedEntityName: string,
): string | null => {
    if (missingProgram) return i18n.t('You only have view access to program');
    if (missingTET) {
        return interpolate(
            'You only have view access to {{trackedEntityName}}',
            trackedEntityName,
        );
    }
    if (missingStage) return i18n.t('You only have view access to this program stage');
    return null;
};

const getDefaultLabel = (
    programWriteAccess: boolean,
    trackedEntityTypeWriteAccess: boolean,
    programStageWriteAccess: boolean,
    trackedEntityName: string,
): string | null => {
    const mp = !programWriteAccess;
    const mt = !trackedEntityTypeWriteAccess;
    const ms = !programStageWriteAccess;
    return getMultiMissingLabel(mp, mt, ms, trackedEntityName)
        ?? getSingleMissingLabel(mp, mt, ms, trackedEntityName);
};

export const ReadOnlyBadge = ({
    readOnly,
    programWriteAccess = true,
    trackedEntityTypeWriteAccess = true,
    programStageWriteAccess = true,
    trackedEntityName,
    label,
}: Props) => {
    const allAccessMissing = !programWriteAccess
        && !trackedEntityTypeWriteAccess
        && !programStageWriteAccess;
    const isReadOnly = readOnly || allAccessMissing;
    if (!isReadOnly) return null;
    const tooltipContent = label
        ?? getDefaultLabel(
            programWriteAccess,
            trackedEntityTypeWriteAccess,
            programStageWriteAccess,
            trackedEntityName ?? i18n.t('person'),
        );
    return (
        <ConditionalTooltip content={tooltipContent ?? ''} enabled={Boolean(tooltipContent)}>
            <Tag neutral icon={<IconInfo16 color={colors.grey700} />}>
                {i18n.t('Read only')}
            </Tag>
        </ConditionalTooltip>
    );
};
