// @flow
import React from 'react';
import i18n from '@dhis2/d2-i18n';
import { IconDelete16, MenuItem } from '@dhis2/ui';
import type { Props } from './DeleteMenuItem.types';
import { ConditionalTooltip } from './ConditionalTooltip';

const getTooltipContent = (canWriteData, canCascadeDeleteTei, trackedEntityTypeName) => {
    if (!canWriteData) {
        return i18n.t("You don't have access to delete this {{TETName}}", {
            TETName: trackedEntityTypeName,
            interpolation: { escapeValue: false },
        });
    }
    if (!canCascadeDeleteTei) {
        return i18n.t("You can't delete this {{TETName}} when it has associated enrollments and events", {
            TETName: trackedEntityTypeName,
            interpolation: { escapeValue: false },
        });
    }
    return '';
};

export const DeleteMenuItem = ({
    trackedEntityTypeName,
    canCascadeDeleteTei,
    canWriteData,
    setActionsIsOpen,
    setDeleteModalIsOpen,
}: Props) => {
    const tooltipContent = getTooltipContent(canWriteData, canCascadeDeleteTei, trackedEntityTypeName);

    return (
        <ConditionalTooltip content={tooltipContent} enabled={!canWriteData || !canCascadeDeleteTei}>
            <MenuItem
                destructive
                dense
                icon={<IconDelete16 />}
                label={i18n.t('Delete {{TETName}}', {
                    TETName: trackedEntityTypeName,
                    interpolation: { escapeValue: false },
                })}
                onClick={() => {
                    setDeleteModalIsOpen(true);
                    setActionsIsOpen(false);
                }}
                disabled={!canWriteData || !canCascadeDeleteTei}
            />
        </ConditionalTooltip>
    );
};
