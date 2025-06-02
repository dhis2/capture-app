import React, { useMemo } from 'react';
import { IconDelete16, MenuItem } from '@dhis2/ui';
import i18n from '@dhis2/d2-i18n';
import { ConditionalTooltip } from '../../../../Tooltips/ConditionalTooltip/';
import type { DeleteMenuItemProps } from '../../types/overflowMenu.types';

const getTooltipContent = (disabled: boolean, trackedEntityTypeName: string) => {
    if (disabled) {
        return i18n.t('You do not have access to delete this {{trackedEntityTypeName}}', {
            trackedEntityTypeName,
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
}: DeleteMenuItemProps) => {
    const disabled = useMemo(() => !canWriteData || !canCascadeDeleteTei, [canWriteData, canCascadeDeleteTei]);
    const tooltipContent = getTooltipContent(disabled, trackedEntityTypeName);

    return (
        <ConditionalTooltip content={tooltipContent} enabled={disabled}>
            <MenuItem
                destructive
                dense
                icon={<IconDelete16 />}
                label={i18n.t('Delete {{trackedEntityTypeName}}', {
                    trackedEntityTypeName,
                    interpolation: { escapeValue: false },
                })}
                onClick={() => {
                    setDeleteModalIsOpen(true);
                    setActionsIsOpen(false);
                }}
                disabled={disabled}
                suffix={null}
            />
        </ConditionalTooltip>
    );
};
