// @flow
import React, { useState } from 'react';
import { Map, TileLayer, Marker, Polygon } from 'react-leaflet';
import { withStyles } from '@material-ui/core';
import { dataElementTypes } from '../../../metaData';
import { MapCoordinatesModalComponent } from './MapCoordinatesModal.component';
import type { MiniMapProps } from './mapCoordinates.types';
import { convertToClientCoordinates } from './convertor';

const styles = () => ({
    mapContainer: {
        width: 150,
        height: 120,
    },
    map: {
        width: '100%',
        height: '100%',
    },
});

const MiniMapPlain = ({ coordinates, type, classes, onSetCoordinates }: MiniMapProps) => {
    const [isModalOpen, setModalOpen] = useState(false);
    const clientValues = convertToClientCoordinates(coordinates, type);
    const center = type === dataElementTypes.COORDINATE ? clientValues : clientValues[0];
    const onMapReady = (mapRef) => {
        if (mapRef?.contextValue && type === dataElementTypes.POLYGON) {
            const { map } = mapRef.contextValue;
            map?.fitBounds(clientValues);
        }
    };

    return (
        <>
            <div className={classes.mapContainer}>
                <Map
                    ref={(mapRef) => {
                        onMapReady(mapRef);
                    }}
                    center={center}
                    className={classes.map}
                    zoom={11}
                    zoomControl={false}
                    attributionControl={false}
                    key="minimap"
                    onClick={() => {
                        setModalOpen(true);
                    }}
                >
                    <TileLayer
                        url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"
                        attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
                    />
                    {type === dataElementTypes.COORDINATE && <Marker position={clientValues} />}
                    {type === dataElementTypes.POLYGON && <Polygon positions={clientValues} />}
                </Map>
            </div>
            <MapCoordinatesModalComponent
                type={type}
                center={center}
                isOpen={isModalOpen}
                setOpen={setModalOpen}
                onSetCoordinates={onSetCoordinates}
                defaultValues={clientValues}
            />
        </>
    );
};

export const MiniMap = withStyles(styles)(MiniMapPlain);
