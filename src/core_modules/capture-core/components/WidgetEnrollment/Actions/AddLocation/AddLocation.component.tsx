import React from 'react';
import { IconLocation16, MenuItem } from '@dhis2/ui';
import i18n from '@dhis2/d2-i18n';
import type { Props } from './addLocation.types';

export const AddLocation = ({ enrollment, setOpenMap }: Props) => {
    const hasGeometry = enrollment?.geometry;

    return (
        <MenuItem
            dense
            dataTest="widget-enrollment-actions-add-location"
            onClick={() => setOpenMap(true)}
            icon={<IconLocation16 />}
            label={hasGeometry ? (i18n.t('Edit location') as string) : (i18n.t('Add location') as string)}
            suffix=""
        />
    );
};
