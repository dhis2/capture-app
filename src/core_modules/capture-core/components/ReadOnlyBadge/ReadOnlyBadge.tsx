import React from 'react';
import { IconInfo16, Tag } from '@dhis2/ui';
import i18n from '@dhis2/d2-i18n';
import { withStyles, type WithStyles } from 'capture-core-utils/styles';
import { ConditionalTooltip } from '../Tooltips/ConditionalTooltip';
import { getReadOnlyMessage } from './getReadOnlyMessage';
import type { Props, Access } from './ReadOnlyBadge.types';

const styles = {
    label: {
        fontWeight: 500,
    },
} as const;

const ReadOnlyBadgePlain = ({
    programWriteAccess = true,
    trackedEntityTypeWriteAccess = true,
    programStageWriteAccess = true,
    isEventBlockedByExpiry = false,
    isEventBlockedByCompletion = false,
    multipleStages = false,
    trackedEntityName,
    trackedEntityInactive = false,
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
        isEventBlockedByExpiry,
        isEventBlockedByCompletion,
        trackedEntityInactive,
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
