// @flow
import React from 'react';
import { useGeometry } from '../hooks/useGeometry';
import type { MapModalProps } from './MapModal.types';
import { MapModal as MapModalComponent } from './MapModal.component';

export const MapModal = ({
    enrollment,
    onUpdate,
    setOpenMap,
    defaultValues,
    center,
}: MapModalProps) => {
    const { geometryType, dataElementType } = useGeometry(enrollment);

    const onSetCoordinates = (coordinates) => {
        if (enrollment && !coordinates) {
            const copyEnrollment = { ...enrollment };
            delete copyEnrollment.geometry;
            onUpdate(copyEnrollment);
            return;
        }
        onUpdate({ ...enrollment, geometry: { type: geometryType, coordinates } });
    };

    return (
        <MapModalComponent
            center={center}
            type={dataElementType}
            setOpen={setOpenMap}
            onSetCoordinates={onSetCoordinates}
            defaultValues={defaultValues}
        />
    );
};
