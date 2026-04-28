import React from 'react';
import i18n from '@dhis2/d2-i18n';
import { IconBlock16, IconCheckmarkCircle16, MenuItem } from '@dhis2/ui';
import type { Props } from './StatusToggleMenuItem.types';
import { ConditionalTooltip } from '../../../../Tooltips/ConditionalTooltip/';

const getTooltipContent = (disabled: boolean, isInactive: boolean, trackedEntityTypeName: string) => {
    if (!disabled) {
        return '';
    }
    return isInactive
        ? i18n.t('You do not have access to activate this {{trackedEntityTypeName}}', {
            trackedEntityTypeName,
            interpolation: { escapeValue: false },
        })
        : i18n.t('You do not have access to deactivate this {{trackedEntityTypeName}}', {
            trackedEntityTypeName,
            interpolation: { escapeValue: false },
        });
};

export const StatusToggleMenuItem = ({
    trackedEntityTypeName,
    isInactive,
    canWriteTETData,
    setActionsIsOpen,
    setStatusToggleModalIsOpen,
}: Props) => {
    const disabled = !canWriteTETData;
    const tooltipContent = getTooltipContent(disabled, isInactive, trackedEntityTypeName);

    const label = isInactive
        ? i18n.t('Activate {{trackedEntityTypeName}}', {
            trackedEntityTypeName,
            interpolation: { escapeValue: false },
        })
        : i18n.t('Deactivate {{trackedEntityTypeName}}', {
            trackedEntityTypeName,
            interpolation: { escapeValue: false },
        });

    return (
        <ConditionalTooltip content={tooltipContent} enabled={disabled}>
            <MenuItem
                destructive={!isInactive}
                dense
                icon={isInactive ? <IconCheckmarkCircle16 /> : <IconBlock16 />}
                label={label}
                onClick={() => {
                    setStatusToggleModalIsOpen(true);
                    setActionsIsOpen(false);
                }}
                disabled={disabled}
                suffix={null}
            />
        </ConditionalTooltip>
    );
};
