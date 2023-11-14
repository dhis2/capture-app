// @flow
import React, { useCallback } from 'react';
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

    const onSetCoordinates = useCallback((coordinates) => {
        const geometry = coordinates ? { type: geometryType, coordinates } : null;
        onUpdate({ ...enrollment, geometry });
    }, [enrollment, geometryType, onUpdate]);

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
