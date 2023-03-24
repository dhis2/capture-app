// @flow
import React, { useState, useMemo } from 'react';
import i18n from '@dhis2/d2-i18n';
import { IconCross24, spacers, Modal, ModalTitle, ModalContent, ModalActions, Button, ButtonStrip } from '@dhis2/ui';
import log from 'loglevel';
import { ReactLeafletSearch } from 'react-leaflet-search-unpolyfilled';
import { capitalizeFirstLetter } from 'capture-core-utils/string';
import { Map, TileLayer, Marker, FeatureGroup, withLeaflet } from 'react-leaflet';
import { EditControl } from 'react-leaflet-draw';
import L from 'leaflet';
import { withStyles } from '@material-ui/core';
import { dataElementTypes } from '../../../metaData';
import type { ModalProps, FeatureCollection } from './mapCoordinates.types';
import { CoordinateInput } from '../../../../capture-ui/internal/CoordinateInput/CoordinateInput.component';

const styles = () => ({
    modalContent: {
        width: '100%',
        height: '100vh',
    },
    map: {
        width: '100%',
        height: 'calc(100vh - 320px)',
    },
    inputWrapper: {
        paddingTop: spacers.dp8,
        display: 'flex',
    },
    inputContent: {
        flexGrow: 1,
    },
    fieldButton: {
        height: '42px !important',
        width: 42,
        borderRadius: '0 !important',
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

const WrappedLeafletSearch = withLeaflet(ReactLeafletSearch);

const MapCoordinatesModalPlain = ({
    classes,
    center: initalCenter,
    isOpen,
    setOpen,
    type,
    defaultValues,
    onSetCoordinates,
}: ModalProps) => {
    const isPoint = useMemo(() => type === dataElementTypes.COORDINATE, [type]);
    const [position, setPosition] = useState(isPoint ? defaultValues : null);
    const [coordinates, setCoordinates] = useState(type === dataElementTypes.POLYGON ? defaultValues : null);
    const [hasChanges, setChanges] = useState(false);
    const [center, setCenter] = useState(initalCenter);
    const [isEditing, setEditing] = useState(!(isPoint && defaultValues));

    const onHandleMapClicked = (mapCoordinates) => {
        if (isPoint && isEditing) {
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

    const onSearch = (searchPosition: any) => {
        setCenter(searchPosition);
        if (isPoint) {
            setPosition(searchPosition);
            setChanges(true);
        }
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
                    ref?.leafletElement?.invalidateSize();
                    if (ref.contextValue && type === dataElementTypes.POLYGON && coordinates) {
                        const { map } = ref.contextValue;
                        map?.fitBounds(coordinates);
                    }
                }, 250);
            }
        }}
        className={classes.map}
        onClick={onHandleMapClicked}
    >
        <WrappedLeafletSearch
            position="topleft"
            inputPlaceholder="Search"
            closeResultsOnClick
            search={null}
            mapStateModifier={onSearch}
            showMarker={false}
            openSearchOnLoad
        />
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
        {isPoint && position && <Marker position={position} />}
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

    const renderLatitude = () =>
        (
            <CoordinateInput
                label={i18n.t('Latitude')}
                value={position && position[0]}
                classes={classes}
                disabled={!isEditing}
                onBlur={(latValue) => {
                    if (!latValue) { return; }
                    const newPosition = [Number(latValue), position && position[1]];
                    if (newPosition?.length === 2) {
                        // $FlowFixMe
                        setPosition(newPosition);
                        setCenter(newPosition);
                        setChanges(true);
                    }
                }}
                onChange={(latValue) => {
                    const newPosition = [Number(latValue), position && position[1]];
                    // $FlowFixMe
                    setPosition(newPosition);
                }}
            />
        );

    const renderLongtitude = () =>
        (
            <CoordinateInput
                label={i18n.t('Longtitude')}
                value={position && position[1]}
                classes={classes}
                disabled={!isEditing}
                onBlur={(lngValue) => {
                    if (!lngValue) { return; }
                    const newPosition = [position && position[0], Number(lngValue)];
                    if (newPosition?.length === 2) {
                        // $FlowFixMe
                        setPosition(newPosition);
                        setCenter(newPosition);
                        setChanges(true);
                    }
                }}
                onChange={(lngValue) => {
                    const newPosition = [position && position[0], Number(lngValue)];
                    // $FlowFixMe
                    setPosition(newPosition);
                }}
            />
        );

    const renderFieldButton = () => (
        <div>
            {!isEditing ? <Button
                className={classes.fieldButton}
                primary
                onClick={() => { setEditing(true); }}
            >
                {i18n.t('Edit')}
            </Button> : <Button
                className={classes.fieldButton}
                disabled={!position}
                icon={<IconCross24 />}
                onClick={() => {
                    // $FlowFixMe
                    setPosition(null);
                }}
            />}
        </div>

    );

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
                <div className={classes.modalContent}>
                    {renderMap()}
                    {isPoint && <div className={classes.inputWrapper}>
                        <div className={classes.inputContent}>
                            {renderLatitude()}
                        </div>
                        <div className={classes.inputContent}>
                            {renderLongtitude()}
                        </div>
                        {renderFieldButton()}
                    </div>}
                </div>
            </ModalContent>
            <ModalActions>
                {renderActions()}
            </ModalActions>
        </Modal>
    );
};
export const MapCoordinatesModal = withStyles(styles)(MapCoordinatesModalPlain);
