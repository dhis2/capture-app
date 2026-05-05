import React from 'react';
import { colors, IconInfo16, Tag } from '@dhis2/ui';
import i18n from '@dhis2/d2-i18n';

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
    if (missingProgram && missingTET && missingStage) {
        return i18n.t('Read only - You can only view this enrollment');
    }
    if (missingProgram && missingTET) {
        return interpolate(
            'Read only - Cannot edit enrollment, {{trackedEntityName}} profile, or relationships',
            trackedEntityName,
        );
    }
    if (missingProgram && missingStage) {
        return i18n.t('Read only - Cannot edit enrollment or events');
    }
    if (missingTET && missingStage) {
        return interpolate(
            'Read only - Cannot edit {{trackedEntityName}} profile, relationships, or events',
            trackedEntityName,
        );
    }
    return null;
};

const getSingleMissingLabel = (
    missingProgram: boolean,
    missingTET: boolean,
    missingStage: boolean,
    trackedEntityName: string,
): string | null => {
    if (missingProgram) return i18n.t('Read only - Cannot edit enrollment');
    if (missingTET) {
        return interpolate(
            'Read only - Cannot edit {{trackedEntityName}} profile or relationships',
            trackedEntityName,
        );
    }
    if (missingStage) return i18n.t('Read only - Cannot edit events');
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
    const isReadOnly = readOnly
        || !programWriteAccess
        || !trackedEntityTypeWriteAccess
        || !programStageWriteAccess;
    if (!isReadOnly) return null;
    const text = label
        ?? getDefaultLabel(
            programWriteAccess,
            trackedEntityTypeWriteAccess,
            programStageWriteAccess,
            trackedEntityName ?? i18n.t('person'),
        )
        ?? i18n.t('Read only - You can only view this enrollment');
    return (
        <Tag maxWidth="400px" neutral icon={<IconInfo16 color={colors.grey700} />}>
            {text}
        </Tag>
    );
};
