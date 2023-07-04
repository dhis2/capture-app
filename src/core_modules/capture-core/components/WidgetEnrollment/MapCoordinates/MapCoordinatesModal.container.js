// @flow
import React from 'react';
import { MapCoordinatesModalComponent } from './MapCoordinatesModal.component';
import { useGeometry } from '../hooks/useGeometry';
import type { MapCoordinatesProps } from './mapCoordinates.types';

const DEFAULT_CENTER = [51.505, -0.09];
export const MapCoordinatesModal = ({ enrollment, onUpdate, isOpenMap, setOpenMap }: MapCoordinatesProps) => {
    const { geometryType, dataElementType } = useGeometry(enrollment);

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
            center={DEFAULT_CENTER}
            isOpen={isOpenMap}
            type={dataElementType}
            setOpen={setOpenMap}
            onSetCoordinates={onSetCoordinates}
        />
    );
};
