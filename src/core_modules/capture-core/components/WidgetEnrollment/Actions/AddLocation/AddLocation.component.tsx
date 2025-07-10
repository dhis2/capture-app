import React from 'react';
import { IconLocation16, MenuItem } from '@dhis2/ui';
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
            onClick={() => setOpenMap(true)}
            icon={<IconLocation16 />}
            label={label}
            suffix=""
        />
    );
};
