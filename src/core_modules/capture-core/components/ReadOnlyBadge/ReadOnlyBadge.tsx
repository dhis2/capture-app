import React from 'react';
import { colors, IconInfo16, Tag } from '@dhis2/ui';
import i18n from '@dhis2/d2-i18n';
import { ConditionalTooltip } from '../Tooltips/ConditionalTooltip';

type Props = {
    readOnly?: boolean;
    programWriteAccess?: boolean;
    trackedEntityTypeWriteAccess?: boolean;
    programStageWriteAccess?: boolean;
    multipleStages?: boolean;
    trackedEntityName?: string;
    label?: string;
    inlineLabel?: boolean;
};

const interpolate = (key: string, trackedEntityName: string) =>
    i18n.t(key, { trackedEntityName, interpolation: { escapeValue: false } });

const stageTarget = (multipleStages: boolean) =>
    (multipleStages ? i18n.t('these program stages') : i18n.t('this program stage'));

const getMultiMissingLabel = (
    missingProgram: boolean,
    missingTET: boolean,
    missingStage: boolean,
    multipleStages: boolean,
    trackedEntityName: string,
): string | null => {
    const parts: Array<string> = [];
    if (missingProgram) parts.push(i18n.t('program'));
    if (missingTET) parts.push(trackedEntityName);
    if (missingStage) parts.push(stageTarget(multipleStages));
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
    multipleStages: boolean,
    trackedEntityName: string,
): string | null => {
    if (missingProgram) return i18n.t('You only have view access to program');
    if (missingTET) {
        return interpolate(
            'You only have view access to {{trackedEntityName}}',
            trackedEntityName,
        );
    }
    if (missingStage) {
        return multipleStages
            ? i18n.t('You only have view access to these program stages')
            : i18n.t('You only have view access to this program stage');
    }
    return null;
};

const getDefaultLabel = (
    programWriteAccess: boolean,
    trackedEntityTypeWriteAccess: boolean,
    programStageWriteAccess: boolean,
    multipleStages: boolean,
    trackedEntityName: string,
): string | null => {
    const mp = !programWriteAccess;
    const mt = !trackedEntityTypeWriteAccess;
    const ms = !programStageWriteAccess;
    if (mp && mt && ms) return i18n.t('You only have view access to enrollment');
    return getMultiMissingLabel(mp, mt, ms, multipleStages, trackedEntityName)
        ?? getSingleMissingLabel(mp, mt, ms, multipleStages, trackedEntityName);
};

export const ReadOnlyBadge = ({
    readOnly,
    programWriteAccess = true,
    trackedEntityTypeWriteAccess = true,
    programStageWriteAccess = true,
    multipleStages = false,
    trackedEntityName,
    label,
    inlineLabel = false,
}: Props) => {
    const allAccessMissing = !programWriteAccess
        && !trackedEntityTypeWriteAccess
        && !programStageWriteAccess;
    const isReadOnly = readOnly || allAccessMissing;
    if (!isReadOnly) return null;
    const message = label
        ?? getDefaultLabel(
            programWriteAccess,
            trackedEntityTypeWriteAccess,
            programStageWriteAccess,
            multipleStages,
            trackedEntityName ?? i18n.t('person'),
        );
    if (inlineLabel) {
        return (
            <span
                style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '5px 6px',
                    borderRadius: 3,
                    background: colors.blue100,
                    color: colors.blue900,
                    fontSize: 13,
                    lineHeight: 1.3,
                    whiteSpace: 'normal',
                    maxWidth: 'none',
                }}
            >
                <span style={{ flexShrink: 0, display: 'inline-flex' }}>
                    <IconInfo16 color={colors.blue800} />
                </span>
                <span style={{ fontWeight: 500 }}>
                    {i18n.t('View only')}
                    {' - '}
                    {message ?? i18n.t('You only have view access')}
                </span>
            </span>
        );
    }
    return (
        <ConditionalTooltip content={message ?? ''} enabled={Boolean(message)}>
            <Tag neutral icon={<IconInfo16 color={colors.grey700} />}>
                {i18n.t('View only')}
            </Tag>
        </ConditionalTooltip>
    );
};
