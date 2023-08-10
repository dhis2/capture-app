// @flow
import { IconLocation16, MenuItem } from '@dhis2/ui';
import React from 'react';
import { useGeometryLabel } from '../../hooks/useGeometry';
import type { Props } from './addLocation.types';

export const AddLocation = ({ enrollment, setOpenMap }: Props) => {
    const label = useGeometryLabel(enrollment);

    if (!label) {
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
