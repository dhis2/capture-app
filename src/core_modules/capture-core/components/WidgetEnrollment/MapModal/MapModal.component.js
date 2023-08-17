// @flow
import React from 'react';
import { dataElementTypes } from '../../../metaData';
import type { ModalProps } from './MapModal.types';
import { Coordinates } from './Coordinates';
import { Polygon } from './Polygon';

export const MapModal = ({ type, center, setOpen, onSetCoordinates, defaultValues }: ModalProps) => (
    <>
        {type === dataElementTypes.COORDINATE && (
            <Coordinates
                center={center}
                setOpen={setOpen}
                onSetCoordinates={onSetCoordinates}
                defaultValues={defaultValues}
            />
        )}
        {type === dataElementTypes.POLYGON && (
            <Polygon
                center={center}
                setOpen={setOpen}
                onSetCoordinates={onSetCoordinates}
                defaultValues={defaultValues}
            />
        )}
    </>
);
