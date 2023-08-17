// @flow
import React, { useState } from 'react';
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

const styles = () => ({
    modalContent: {
        width: '100%',
    },
    map: {
        width: '100%',
        height: 'calc(100vh - 380px)',
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

const WrappedLeafletSearch = withLeaflet(ReactLeafletSearch);

const PolygonPlain = ({
    classes,
    center: initialCenter,
    setOpen,
    defaultValues,
    onSetCoordinates,
}: PolygonProps) => {
    const [polygonArea, setPolygonArea] = useState(defaultValues);
    const [center, setCenter] = useState(initialCenter);


    const resetToDefaultValues = () => {
        setCenter(initialCenter);
        setPolygonArea(defaultValues);
    };

    const onMapPolygonCreated = (e: any) => {
        const polygonCoordinates = e.layer.toGeoJSON().geometry.coordinates[0].map(c => [c[1], c[0]]);
        setPolygonArea(polygonCoordinates);
    };

    const onMapPolygonEdited = (e: any) => {
        const polygonCoordinates = e.layers
            .getLayers()[0]
            .toGeoJSON()
            .geometry.coordinates[0].map(c => [c[1], c[0]]);
        setPolygonArea(polygonCoordinates);
    };

    const onMapPolygonDelete = () => {
        setPolygonArea(null);
    };

    const onSearch = (searchPosition: any) => {
        setCenter(searchPosition);
    };

    const getFeatureCollection = () => (Array.isArray(polygonArea) ? coordsToFeatureCollection(polygonArea) : null);

    const renderMap = () => (
        <Map
            center={center}
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
                    edit={{
                        remove: false,
                    }}
                />
                <DeleteControl onClick={onMapPolygonDelete} disabled={!polygonArea} />
            </FeatureGroup>
        </Map>
    );

    const onFeatureGroupReady = (reactFGref: any, featureCollection: ?FeatureCollection) => {
        if (!reactFGref) {
            return;
        }
        if (featureCollection) {
            const leafletGeoJSON = new L.GeoJSON(featureCollection);
            if (reactFGref) {
                const leafletFG = reactFGref.leafletElement;
                leafletFG.clearLayers();

                leafletGeoJSON.eachLayer((layer) => {
                    leafletFG.addLayer(layer);
                });
            }
        } else {
            const leafletFG = reactFGref.leafletElement;
            leafletFG.clearLayers();
        }
    };

    const renderActions = () => (
        <ButtonStrip end>
            <Button
                onClick={() => {
                    resetToDefaultValues();
                    setOpen(false);
                }}
                secondary
            >
                {i18n.t('Cancel')}
            </Button>
            <Button
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
