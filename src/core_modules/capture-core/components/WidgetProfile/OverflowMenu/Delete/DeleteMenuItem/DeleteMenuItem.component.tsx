import React from 'react';
import i18n from '@dhis2/d2-i18n';
import { IconDelete16, MenuItem } from '@dhis2/ui';
import type { Props } from './DeleteMenuItem.types';
import { ConditionalTooltip } from '../../../../Tooltips/ConditionalTooltip/';

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
    readOnly,
    setActionsIsOpen,
    setDeleteModalIsOpen,
}: Props) => {
    const disabled = readOnly || !canCascadeDeleteTei;
    const tooltipContent = getTooltipContent(disabled, trackedEntityTypeName);

    return (
        <ConditionalTooltip content={tooltipContent} enabled={false}>
            <MenuItem
                destructive
                dense
                icon={<IconDelete16 />}
                label={i18n.t('Deleteee {{trackedEntityTypeName}}', {
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
