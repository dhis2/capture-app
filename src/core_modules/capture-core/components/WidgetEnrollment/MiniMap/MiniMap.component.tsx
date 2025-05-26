import React, { useState } from 'react';
import { Map, TileLayer, Marker, Polygon } from 'react-leaflet';
import { withStyles } from '@material-ui/core';
import { dataElementTypes } from '../../../metaData';
import { MapModal } from '../MapModal';
import type { MiniMapProps } from './MiniMap.types';
import { styles } from './MiniMap.types';
import { convertToClientCoordinates } from './converters';
import { useUpdateEnrollment } from '../dataMutation/dataMutation';

const MiniMapPlain = ({
    coordinates,
    geometryType,
    enrollment,
    refetchEnrollment,
    refetchTEI,
    onError,
    classes,
}: MiniMapProps) => {
    const [isOpenMap, setOpenMap] = useState(false);
    const { updateMutation = () => { /* empty by design */ } } = useUpdateEnrollment(refetchEnrollment, refetchTEI, onError) || {};
    const clientValues = convertToClientCoordinates(coordinates, geometryType);
    const center = geometryType === dataElementTypes.COORDINATE ? clientValues : clientValues[0];
    const onMapReady = (mapRef: any) => {
        if (mapRef?.contextValue && geometryType === dataElementTypes.POLYGON) {
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
                        setOpenMap(true);
                    }}
                >
                    <TileLayer
                        url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"
                        attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
                    />
                    {geometryType === dataElementTypes.COORDINATE && <Marker position={clientValues} />}
                    {geometryType === dataElementTypes.POLYGON && <Polygon positions={clientValues} />}
                </Map>
            </div>
            {isOpenMap && (
                <MapModal
                    center={center}
                    setOpenMap={setOpenMap}
                    defaultValues={clientValues}
                    onUpdate={updateMutation}
                    enrollment={enrollment}
                />
            )}
        </>
    );
};

export const MiniMap = withStyles(styles)(MiniMapPlain);
