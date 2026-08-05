import React from 'react';
import i18n from '@dhis2/d2-i18n';
import { MenuItem } from '@dhis2/ui';

type Props = {
    onOpenChangelog: () => void;
    onClose: () => void;
};

export const ChangelogMenuItem = ({ onOpenChangelog, onClose }: Props) => (
    <MenuItem
        dense
        label={i18n.t('View changelog')}
        suffix={null}
        onClick={() => {
            onOpenChangelog();
            onClose();
        }}
    />
);
