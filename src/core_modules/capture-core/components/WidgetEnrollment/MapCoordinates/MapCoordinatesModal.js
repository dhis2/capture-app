// @flow
import React, { useState } from 'react';
import i18n from '@dhis2/d2-i18n';
import log from 'loglevel';
import { capitalizeFirstLetter } from 'capture-core-utils/string';
import { Modal, ModalTitle, ModalContent, ModalActions, Button, ButtonStrip } from '@dhis2/ui';
import { Map, TileLayer, Marker, FeatureGroup } from 'react-leaflet';
import { EditControl } from 'react-leaflet-draw';
import L from 'leaflet';
import { withStyles } from '@material-ui/core';
import { dataElementTypes } from '../../../metaData';
import type { ModalProps, FeatureCollection } from './mapCoordinates.types';

const styles = () => ({
    modalContent: {
        width: '100%',
        height: '75vh',
    },
    map: {
        width: '100%',
        height: '100%',
    },
});

const convertToServerCoordinates =
(coordinates?: Array<[number, number]> | null, type: string): ?[number, number] | ?Array<[number, number]> | ?[number, number] => {
    if (!coordinates) { return null; }
    switch (type) {
    case dataElementTypes.COORDINATE: {
        const lng: number = coordinates[0][1];
        const lat: number = coordinates[0][0];
        return [lng, lat];
    }
    case dataElementTypes.POLYGON:
        return Array<[number, number]>(coordinates.map(c => [c[1], c[0]]));
    default:
        return coordinates;
    }
};


const MapCoordinatesModalPlain = ({ classes, center, isOpen, setOpen, type, defaultValues, onSetCoordinates }: ModalProps) => {
    const [position, setPosition] = useState(type === dataElementTypes.COORDINATE ? defaultValues : null);
    const [coordinates, setCoordinates] = useState(type === dataElementTypes.POLYGON ? defaultValues : null);
    const [hasChanges, setChanges] = useState(false);

    const onHandleMapClicked = (mapCoordinates) => {
        if (type === dataElementTypes.COORDINATE) {
            const { lat, lng } = mapCoordinates.latlng;
            const newPosition: [number, number] = [lat, lng];
            setPosition(newPosition);
            setChanges(true);
        }
    };

    const onMapPolygonCreated = (e: any) => {
        const polygonCoordinates = e.layer.toGeoJSON().geometry.coordinates[0].map(c => [c[1], c[0]]);
        setCoordinates(polygonCoordinates);
        setChanges(true);
    };

    const onMapPolygonEdited = (e: any) => {
        const polygonCoordinates = e.layers.getLayers()[0].toGeoJSON().geometry.coordinates[0].map(c => [c[1], c[0]]);
        setCoordinates(polygonCoordinates);
        setChanges(true);
    };

    const onMapPolygonDelete = () => {
        setCoordinates(null);
    };

    const coordsToFeatureCollection = (inputCoordinates): ?FeatureCollection => {
        if (!inputCoordinates) {
            return null;
        }
        const list = inputCoordinates[0].length > 2
            ? inputCoordinates[0]
            : inputCoordinates.map(c => [c[1], c[0]]);

        return {
            type: 'FeatureCollection',
            features: [
                {
                    type: 'Feature',
                    properties: {},
                    geometry: {
                        type: 'Polygon',
                        coordinates: [list],
                    },
                },
            ],
        };
    };

    const getFeatureCollection = () =>
        (Array.isArray(coordinates) ? coordsToFeatureCollection(coordinates) : null);

    const renderMap = () => (<Map
        center={center}
        zoom={13}
        ref={(ref) => {
            if (ref?.leafletElement) {
                setTimeout(() => {
                    ref.leafletElement.invalidateSize();
                    if (type === dataElementTypes.POLYGON && coordinates) {
                        const { map } = ref.contextValue;
                        map.fitBounds(coordinates);
                    }
                }, 250);
            }
        }}
        className={classes.map}
        onClick={onHandleMapClicked}
    >
        <TileLayer
            url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"
            attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
        />
        {type === dataElementTypes.POLYGON && <FeatureGroup
            ref={(reactFGref) => {
                onFeatureGroupReady(reactFGref, getFeatureCollection());
            }}
        >
            <EditControl
                position="topright"
                onEdited={onMapPolygonEdited}
                onCreated={onMapPolygonCreated}
                onDeleted={onMapPolygonDelete}
                draw={{
                    rectangle: false,
                    polyline: false,
                    circle: false,
                    marker: false,
                    circlemarker: false,
                }}
            />
        </FeatureGroup>}
        {type === dataElementTypes.COORDINATE && position && <Marker position={position} />}
    </Map>);

    const onFeatureGroupReady = (reactFGref: any, featureCollection: ?FeatureCollection) => {
        if (featureCollection) {
            const leafletGeoJSON = new L.GeoJSON(featureCollection);
            if (reactFGref) {
                const leafletFG = reactFGref.leafletElement;
                leafletFG.clearLayers();

                leafletGeoJSON.eachLayer((layer) => {
                    leafletFG.addLayer(layer);
                });
            }
        } else if (reactFGref) {
            const leafletFG = reactFGref.leafletElement;
            leafletFG.clearLayers();
        }
    };

    const getTitle = () => {
        switch (type) {
        case dataElementTypes.COORDINATE:
            return i18n.t('coordinates');
        case dataElementTypes.POLYGON:
            return i18n.t('area');
        default:
            log.error(`${type} is not handled`);
            return '';
        }
    };

    const renderActions = () => (<ButtonStrip end>
        <Button
            onClick={() => {
                setOpen(false);
            }}
            secondary
        >
            {i18n.t('Cancel')}
        </Button>
        <Button
            disabled={!hasChanges}
            onClick={() => {
                if (position ?? coordinates) {
                    const clientValue = position ? [position] : coordinates;
                    const convertedCoordinates = convertToServerCoordinates(clientValue, type);
                    onSetCoordinates(convertedCoordinates);
                    setOpen(false);
                }
            }}
            primary
        >
            {`${i18n.t('Set')} ${getTitle()}`}
        </Button>
    </ButtonStrip>);

    return (
        <Modal
            hide={!isOpen}
            large
        >
            <ModalTitle>
                {capitalizeFirstLetter(getTitle())}
            </ModalTitle>
            <ModalContent>
                <div className={classes.modalContent}>{renderMap()}</div>
            </ModalContent>
            <ModalActions>
                {renderActions()}
            </ModalActions>
        </Modal>
    );
};
export const MapCoordinatesModal = withStyles(styles)(MapCoordinatesModalPlain);
