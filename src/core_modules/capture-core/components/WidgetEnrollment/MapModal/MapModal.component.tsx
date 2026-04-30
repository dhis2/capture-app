import React from 'react';
import { dataElementTypes } from '../../../metaData';
import type { MapModalComponentProps } from './MapModal.types';
import './MapModal.css';
import { Coordinates } from './Coordinates';
import { Polygon } from './Polygon';

export const MapModal = ({ type, center, setOpen, onSetCoordinates, defaultValues, readOnly }: MapModalComponentProps) => (
    <>
        {type === dataElementTypes.COORDINATE && (
            <Coordinates
                center={center}
                setOpen={setOpen}
                onSetCoordinates={onSetCoordinates}
                defaultValues={defaultValues as [number, number] | null}
                readOnly={readOnly}
            />
        )}
        {type === dataElementTypes.POLYGON && (
            <Polygon
                center={center}
                setOpen={setOpen}
                onSetCoordinates={onSetCoordinates}
                defaultValues={defaultValues as number[][] | null}
                readOnly={readOnly}
            />
        )}
    </>
);
