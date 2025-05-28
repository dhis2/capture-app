import React, { useCallback } from 'react';
import { useGeometry } from '../hooks/useGeometry';
import type { MapModalProps } from './MapModal.types';
import { MapModal as MapModalComponent } from './MapModal.component';
import { useCenterPoint } from './hooks';

export const MapModal = ({
    enrollment,
    onUpdate,
    setOpenMap,
    defaultValues,
    center: storedCenter,
}: MapModalProps) => {
    const { geometryType, dataElementType } = useGeometry(enrollment as { program: string });
    const { center: centerPoint } = useCenterPoint(enrollment.orgUnit as string, storedCenter);

    const onSetCoordinates = useCallback((coordinates: [number, number] | Array<[number, number]> | null) => {
        const geometry = coordinates ? { type: geometryType, coordinates } : null;
        onUpdate({ ...enrollment, geometry });
    }, [enrollment, geometryType, onUpdate]);

    return (
        <MapModalComponent
            center={centerPoint ?? null}
            type={dataElementType}
            setOpen={setOpenMap}
            onSetCoordinates={onSetCoordinates}
            defaultValues={defaultValues}
        />
    );
};
