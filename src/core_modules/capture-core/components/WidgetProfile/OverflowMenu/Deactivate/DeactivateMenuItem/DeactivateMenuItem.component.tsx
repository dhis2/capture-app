import React from 'react';
import i18n from '@dhis2/d2-i18n';
import { IconBlock16, IconCheckmarkCircle16, MenuItem } from '@dhis2/ui';
import type { Props } from './DeactivateMenuItem.types';

export const DeactivateMenuItem = ({
    trackedEntityTypeName,
    trackedEntityInactive,
    setActionsIsOpen,
    setDeactivateModalIsOpen,
}: Props) => {
    const label = trackedEntityInactive
        ? i18n.t('Activate {{trackedEntityTypeName}}', {
            trackedEntityTypeName,
            interpolation: { escapeValue: false },
        })
        : i18n.t('Deactivate {{trackedEntityTypeName}}', {
            trackedEntityTypeName,
            interpolation: { escapeValue: false },
        });

    return (
        <MenuItem
            dense
            icon={trackedEntityInactive ? <IconCheckmarkCircle16 /> : <IconBlock16 />}
            destructive={!trackedEntityInactive}
            label={label}
            onClick={() => {
                setDeactivateModalIsOpen(true);
                setActionsIsOpen(false);
            }}
            suffix={null}
            dataTest="tracked-entity-deactivate-menu-item"
        />
    );
};
