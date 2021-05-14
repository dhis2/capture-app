// @flow
import { IconDelete16, MenuItem } from '@dhis2/ui';
import React from 'react';
import i18n from '@dhis2/d2-i18n';

export const Delete = () => (
    <MenuItem
        dense
        icon={<IconDelete16 />}
        destructive
        label={i18n.t('Delete')}
    />
);
