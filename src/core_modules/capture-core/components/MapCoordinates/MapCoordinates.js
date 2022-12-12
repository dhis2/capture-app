// @flow
import React from 'react';
import { Map, TileLayer, Marker, Polygon } from 'react-leaflet';
import { withStyles } from '@material-ui/core';
import { dataElementTypes } from '../../metaData';


type Props = $ReadOnly<{|
    coordinates: any,
    type: string,
    classes: Object
|}>;

const styles = () => ({
    map: {
        width: 150,
        height: 120,
    },
});

const convertToClientCoordinates = (coordinates, type) => {
    switch (type) {
    case dataElementTypes.COORDINATE:
        return [coordinates[1], coordinates[0]];
    default:
        return coordinates.map(coord => [coord[1], coord[0]]);
    }
};

const MapCoordinatesPlain = ({ coordinates, type, classes }: Props) => {
    const clientValues = convertToClientCoordinates(coordinates, type);
    const center = type === dataElementTypes.COORDINATE ? clientValues : clientValues[0][0];

    return (
        <Map
            center={center}
            className={classes.map}
            zoom={8}
            zoomControl={false}
            attributionControl={false}
            key="map"
        >
            <TileLayer
                url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"
                attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
            />
            {type === dataElementTypes.COORDINATE && <Marker position={clientValues} />}
            {type === dataElementTypes.POLYGON && <Polygon positions={clientValues[0]} />}
        </Map>
    );
};

export const MapCoordinates = withStyles(styles)(MapCoordinatesPlain);
