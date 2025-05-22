import React from 'react';
import { dataElementTypes } from '../../../metaData';
import type { MapModalComponentProps } from './MapModal.types';
import { Coordinates } from './Coordinates';
import { Polygon } from './Polygon';

export const MapModal = ({ type, center, setOpen, onSetCoordinates, defaultValues }: MapModalComponentProps) => (
    <>
        {type === dataElementTypes.COORDINATE && (
            <Coordinates
                center={center as [number, number] | undefined}
                setOpen={setOpen}
                onSetCoordinates={onSetCoordinates as any}
                defaultValues={defaultValues as [number, number] | undefined}
            />
        )}
        {type === dataElementTypes.POLYGON && (
            <Polygon
                center={center as [number, number] | undefined}
                setOpen={setOpen}
                onSetCoordinates={onSetCoordinates as any}
                defaultValues={defaultValues as number[][] | undefined}
            />
        )}
    </>
);
