// @flow
import React from 'react';
import { MapCoordinatesModalComponent } from './MapCoordinatesModal.component';
import { useGeometry } from '../hooks/useGeometry';
import { useCenterPoint } from '../hooks/useCenterPoint';
import type { MapCoordinatesProps } from './mapCoordinates.types';

export const MapCoordinatesModal = ({ enrollment, onUpdate, isOpenMap, setOpenMap }: MapCoordinatesProps) => {
    const { geometryType, dataElementType } = useGeometry(enrollment);
    const { center, loading } = useCenterPoint(enrollment.orgUnit);

    if (!geometryType) {
        return null;
    }

    const onSetCoordinates = (coord) => {
        if (!coord) {
            const copyEnrollment = { ...enrollment };
            delete copyEnrollment.geometry;
            onUpdate(copyEnrollment);
            return;
        }
        onUpdate({ ...enrollment, geometry: { type: geometryType, coordinates: coord } });
    };

    return (
        <MapCoordinatesModalComponent
            ready={!loading}
            center={center}
            isOpen={isOpenMap}
            type={dataElementType}
            setOpen={setOpenMap}
            onSetCoordinates={onSetCoordinates}
        />
    );
};
