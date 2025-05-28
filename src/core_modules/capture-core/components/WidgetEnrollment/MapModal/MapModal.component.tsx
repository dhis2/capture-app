import React from 'react';
import { dataElementTypes } from '../../../metaData';
import type { MapModalComponentProps } from './MapModal.types';
import { Coordinates } from './Coordinates';
import { Polygon } from './Polygon';

export const MapModal = ({ type, center, setOpen, onSetCoordinates, defaultValues }: MapModalComponentProps) => (
    <>
        {type === dataElementTypes.COORDINATE && (
            <Coordinates
                center={center}
                setOpen={setOpen}
                onSetCoordinates={onSetCoordinates}
                defaultValues={defaultValues as [number, number] | null}
                classes={{}} // Added empty classes object to satisfy type requirement
            />
        )}
        {type === dataElementTypes.POLYGON && (
            <Polygon
                center={center}
                setOpen={setOpen}
                onSetCoordinates={onSetCoordinates}
                defaultValues={defaultValues as number[][] | null}
                classes={{}} // Added empty classes object to satisfy type requirement
            />
        )}
    </>
);
