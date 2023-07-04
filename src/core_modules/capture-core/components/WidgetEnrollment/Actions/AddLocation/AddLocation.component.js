// @flow
import { IconLocation16, MenuItem } from '@dhis2/ui';
import React from 'react';
import { useGeometry } from '../../hooks/useGeometry';
import type { Props } from './addLocation.types';

export const AddLocation = ({ enrollment, setOpenMap }: Props) => {
    const { label, geometryType } = useGeometry(enrollment);

    if (!geometryType) {
        return null;
    }

    return (
        <MenuItem
            dense
            dataTest="widget-enrollment-actions-add-location"
            icon={<IconLocation16 />}
            label={label}
            onClick={() => setOpenMap(true)}
        />
    );
};
