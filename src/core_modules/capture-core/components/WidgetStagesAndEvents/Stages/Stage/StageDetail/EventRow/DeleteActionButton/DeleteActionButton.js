// @flow
import React from 'react';
import i18n from '@dhis2/d2-i18n';
import {
    colors,
    IconDelete16,
    MenuItem,
} from '@dhis2/ui';

type Props = {
    setActionsOpen: (open: boolean) => void,
    setDeleteModalOpen: (open: boolean) => void,
};

export const DeleteActionButton = ({
    setActionsOpen,
    setDeleteModalOpen,
}: Props) => (
    <>
        <MenuItem
            dense
            icon={<IconDelete16 color={colors.red600} />}
            label={i18n.t('Delete')}
            onClick={() => {
                setDeleteModalOpen(true);
                setActionsOpen(false);
            }}
        />
    </>
);
