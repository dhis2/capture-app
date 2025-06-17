import React from 'react';
import { IconAdd16, MenuItem } from '@dhis2/ui';
import i18n from '@dhis2/d2-i18n';
import type { Props } from './addNew.types';

export const AddNew = ({ tetName, canAddNew, onlyEnrollOnce, onAddNew }: Props) => {
    if (!canAddNew || onlyEnrollOnce) {
        return null;
    }

    return (
        <MenuItem
            dense
            dataTest="widget-enrollment-actions-add-new"
            onClick={() => onAddNew({})}
            icon={<IconAdd16 />}
            label={i18n.t('Add new {{tetName}}', { tetName }) as string}
            suffix=""
        />
    );
};
