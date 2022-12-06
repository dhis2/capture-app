// @flow
import React from 'react';
import { Map, TileLayer, Marker } from 'react-leaflet';
import { withStyles } from '@material-ui/core';

type Props = $ReadOnly<{|
  latitude: number | string,
  longitude: number | string,
  classes: Object
|}>;

const styles = () => ({
    map: {
        width: 150,
        height: 120,
    },
});

const MapCoordinatesPlain = withStyles(styles)(({ latitude, longitude, classes }: Props) => {
    const position = [longitude, latitude];
    return (
        <Map
            center={position}
            className={classes.map}
            zoom={3}
            zoomControl={false}
            attributionControl={false}
            key="map"
        >
            <TileLayer
                url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"
                attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
            />
            <Marker position={position} />
        </Map>
    );
},
);

export const MapCoordinates = (props: Props) => <MapCoordinatesPlain {...props} />;
