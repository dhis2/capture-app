import React from 'react';
import i18n from '@dhis2/d2-i18n';
import { IconBlock16, IconCheckmarkCircle16, MenuItem } from '@dhis2/ui';

type Props = {
    trackedEntityTypeName: string;
    trackedEntityInactive: boolean;
    setActionsIsOpen: (open: boolean) => void;
    setDeactivateModalIsOpen: (open: boolean) => void;
};

export const DeactivateMenuItem = ({
    trackedEntityTypeName,
    trackedEntityInactive,
    setActionsIsOpen,
    setDeactivateModalIsOpen,
}: Props) => {
    const interp = { trackedEntityTypeName, interpolation: { escapeValue: false } };
    const label = trackedEntityInactive
        ? i18n.t('Activate {{trackedEntityTypeName}}', interp)
        : i18n.t('Deactivate {{trackedEntityTypeName}}', interp);

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
