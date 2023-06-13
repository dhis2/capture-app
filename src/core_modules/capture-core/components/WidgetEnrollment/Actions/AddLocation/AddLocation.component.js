// @flow
import { IconLocation16, MenuItem } from '@dhis2/ui';
import React, { useState, useMemo } from 'react';
import i18n from '@dhis2/d2-i18n';
import { dataElementTypes } from '../../../../metaData';
import { MapCoordinatesModal } from '../../MapCoordinates';
import { useProgram } from '../../hooks/useProgram';
import { useCenterPoint } from '../../hooks/useCenterPoint';
import type { Props } from './addLocation.types';

export const AddLocation = ({ enrollment, onUpdate }: Props) => {
    const [isOpen, setOpen] = useState(false);
    const { program, error } = useProgram(enrollment.program);
    const geometryType = useMemo(() => {
        if (!program) { return undefined; }
        return program.featureType === 'POINT' ? dataElementTypes.COORDINATE : dataElementTypes.POLYGON;
    }, [program]);
    const { center, loading } = useCenterPoint(enrollment.orgUnit);
    if (error) {
        return null;
    }
    if (enrollment.geometry || !program?.featureType || program.featureType === 'NONE') {
        return null;
    }
    const getServerFeatureType = () => {
        switch (geometryType) {
        case dataElementTypes.COORDINATE:
            return 'Point';
        case dataElementTypes.POLYGON:
            return 'Polygon';
        default:
            return '';
        }
    };
    const getLabel = () => {
        switch (geometryType) {
        case dataElementTypes.COORDINATE:
            return i18n.t('Add coordinates');
        default:
            return i18n.t('Add area');
        }
    };

    return (<>
        <MenuItem
            dense
            dataTest="widget-enrollment-actions-add-location"
            icon={<IconLocation16 />}
            label={getLabel()}
            onClick={() => { setOpen(true); }}
        />
        <MapCoordinatesModal
            ready={!loading}
            center={center}
            isOpen={isOpen}
            type={geometryType}
            setOpen={setOpen}
            onSetCoordinates={(coord) => {
                if (!coord) {
                    const copyEnrollment = { ...enrollment };
                    delete copyEnrollment.geometry;
                    onUpdate(copyEnrollment);
                    return;
                }
                onUpdate({ ...enrollment, geometry: { type: getServerFeatureType(), coordinates: coord } });
            }}
        />
    </>);
};
