// @flow
import React, { useState, useRef } from 'react';
import i18n from '@dhis2/d2-i18n';
import { Modal, ModalTitle, ModalContent, ModalActions, Button, ButtonStrip } from '@dhis2/ui';
import { ReactLeafletSearch } from 'react-leaflet-search-unpolyfilled';
import { Map, TileLayer, FeatureGroup, withLeaflet } from 'react-leaflet';
import { EditControl } from 'react-leaflet-draw';
import L from 'leaflet';
import { withStyles } from '@material-ui/core';
import type { PolygonProps, FeatureCollection } from './Polygon.types';
import { convertPolygonToServer } from './converters';
import { DeleteControl } from './DeleteControl.component';
import { ConditionalTooltip } from './ConditionalTooltip.component';

const styles = () => ({
    modalContent: {
        width: '100%',
    },
    map: {
        width: '100%',
        height: 'calc(100vh - 380px)',
    },
    setAreaButton: {
        marginLeft: '5px',
    },
});

const coordsToFeatureCollection = (inputCoordinates: any): ?FeatureCollection => {
    if (!inputCoordinates) {
        return null;
    }
    const list = inputCoordinates[0].length > 2 ? inputCoordinates[0] : inputCoordinates.map(c => [c[1], c[0]]);

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

const drawing = {
    STARTED: 'STARTED',
    FINISHED: 'FINISHED',
};

const WrappedLeafletSearch = withLeaflet(ReactLeafletSearch);

const PolygonPlain = ({
    classes,
    center: initialCenter,
    setOpen,
    defaultValues,
    onSetCoordinates,
}: PolygonProps) => {
    const [polygonArea, setPolygonArea] = useState(defaultValues);
    const [center, setCenter] = useState();
    const [drawingState, setDrawingState] = useState(undefined);
    const prevDrawingState = useRef(undefined);

    const resetToDefaultValues = () => {
        setCenter(initialCenter);
        setPolygonArea(defaultValues);
    };

    const onMapPolygonCreated = (e: any) => {
        const polygonCoordinates = e.layer.toGeoJSON().geometry.coordinates[0].map(c => [c[1], c[0]]);
        setPolygonArea(polygonCoordinates);
        setDrawingState(drawing.FINISHED);
        prevDrawingState.current = drawing.FINISHED;
    };

    const onMapPolygonDelete = () => {
        setPolygonArea(null);
        setDrawingState(drawing.FINISHED);
        prevDrawingState.current = drawing.FINISHED;
    };

    const onSearch = (searchPosition: any) => {
        setCenter(searchPosition);
    };

    const getFeatureCollection = () => (Array.isArray(polygonArea) ? coordsToFeatureCollection(polygonArea) : null);

    const renderMap = () => (
        <Map
            center={center ?? initialCenter}
            zoom={13}
            ref={(ref) => {
                if (ref?.leafletElement) {
                    ref.leafletElement.invalidateSize();
                    if (ref.contextValue && polygonArea) {
                        const { map } = ref.contextValue;
                        map?.fitBounds(polygonArea);
                    }
                }
            }}
            className={classes.map}
        >
            <WrappedLeafletSearch
                position="topright"
                inputPlaceholder="Search"
                closeResultsOnClick
                search={null}
                mapStateModifier={onSearch}
                showMarker={false}
                openSearchOnLoad
            />
            <TileLayer
                url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            />
            <FeatureGroup
                ref={(reactFGref) => {
                    onFeatureGroupReady(reactFGref, getFeatureCollection());
                }}
            >
                <EditControl
                    position="topright"
                    onCreated={onMapPolygonCreated}
                    onDeleted={onMapPolygonDelete}
                    onDrawStart={() => setDrawingState(drawing.STARTED)}
                    onDrawStop={() => setDrawingState(prevDrawingState.current)}
                    draw={{
                        rectangle: false,
                        polyline: false,
                        circle: false,
                        marker: false,
                        circlemarker: false,
                    }}
                    edit={{
                        remove: false,
                        edit: false,
                    }}
                />
                <DeleteControl
                    onClick={onMapPolygonDelete}
                    disabled={!polygonArea || drawingState === drawing.STARTED}
                />
            </FeatureGroup>
        </Map>
    );

    const onFeatureGroupReady = (reactFGref: any, featureCollection: ?FeatureCollection) => {
        if (!reactFGref) {
            return;
        }
        if (featureCollection) {
            const leafletGeoJSON = new L.GeoJSON(featureCollection);
            const leafletFG = reactFGref.leafletElement;
            leafletFG.clearLayers();

            leafletGeoJSON.eachLayer((layer) => {
                leafletFG.addLayer(layer);
            });
        } else {
            const leafletFG = reactFGref.leafletElement;
            leafletFG.clearLayers();
        }
    };

    const renderActions = () => (
        <ButtonStrip end>
            {!drawingState && (
                <Button
                    onClick={() => {
                        resetToDefaultValues();
                        setOpen(false);
                    }}
                    secondary
                >
                    {i18n.t('Close')}
                </Button>
            )}
            {drawingState && (
                <>
                    <Button
                        onClick={() => {
                            resetToDefaultValues();
                            setOpen(false);
                        }}
                        secondary
                    >
                        {i18n.t('Close without saving')}
                    </Button>
                    <ConditionalTooltip
                        content={i18n.t('Finish drawing before saving')}
                        enabled={drawingState === drawing.STARTED}
                    >
                        <Button
                            disabled={drawingState === drawing.STARTED}
                            className={classes.setAreaButton}
                            onClick={() => {
                                const clientValue = polygonArea;
                                const convertedCoordinates = convertPolygonToServer(clientValue);
                                onSetCoordinates(convertedCoordinates);
                                setOpen(false);
                            }}
                            primary
                        >
                            {i18n.t('Set area')}
                        </Button>
                    </ConditionalTooltip>
                </>
            )}
        </ButtonStrip>
    );

    return (
        <Modal large>
            <ModalTitle> {i18n.t('Area')}</ModalTitle>
            <ModalContent className={classes.modalContent}>{renderMap()}</ModalContent>
            <ModalActions>{renderActions()}</ModalActions>
        </Modal>
    );
};

export const Polygon = withStyles(styles)(PolygonPlain);
