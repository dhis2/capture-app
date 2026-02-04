import React, { useState, useRef, type ComponentType } from 'react';
import i18n from '@dhis2/d2-i18n';
import { Modal, ModalTitle, ModalContent, ModalActions, Button, ButtonStrip } from '@dhis2/ui';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import { Map, TileLayer, FeatureGroup, ZoomControl, withLeaflet } from 'react-leaflet';
import { withStyles, type WithStyles } from 'capture-core-utils/styles';
import { ReactLeafletSearch } from 'react-leaflet-search-unpolyfilled';
import { EditControl } from 'react-leaflet-draw';
import L from 'leaflet';
import { isLangRtl } from '../../../../utils/rtl';
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
        marginInlineStart: '5px',
    },
});

const drawing = {
    STARTED: 'STARTED',
    FINISHED: 'FINISHED',
};

type Props = PolygonProps & WithStyles<typeof styles>;

const coordsToFeatureCollection = (inputCoordinates: any): FeatureCollection | null => {
    if (!inputCoordinates) {
        return null;
    }
    const list = inputCoordinates[0]?.length > 2 ? inputCoordinates[0] : inputCoordinates.map((c: number[]) => [c[1], c[0]]);

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
}: Props) => {
    const [polygonArea, setPolygonArea] = useState<Array<Array<number>> | null>(defaultValues ?? null);
    const [center, setCenter] = useState<[number, number] | undefined>(undefined);
    const [drawingState, setDrawingState] = useState<string | undefined>(undefined);
    const prevDrawingState = useRef<string | undefined>(undefined);

    const resetToDefaultValues = () => {
        setCenter(initialCenter ?? undefined);
        setPolygonArea(defaultValues ?? null);
    };

    const onMapPolygonCreated = (e: any) => {
        const polygonCoordinates = e.layer.toGeoJSON().geometry.coordinates[0].map((c: number[]) => [c[1], c[0]]);
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
            zoomControl={false}
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
            <ZoomControl position={isLangRtl() ? 'bottomleft' : 'bottomright'} />
            <WrappedLeafletSearch
                position={isLangRtl() ? 'topright' : 'topleft'}
                inputPlaceholder={i18n.t('Search')}
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
                    position={isLangRtl() ? 'topleft' : 'topright'}
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

    const onFeatureGroupReady = (reactFGref: any, featureCollection: FeatureCollection | null) => {
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
            <ModalTitle>{i18n.t('Area')}</ModalTitle>
            <ModalContent className={classes.modalContent}>{renderMap()}</ModalContent>
            <ModalActions>{renderActions()}</ModalActions>
        </Modal>
    );
};

export const Polygon = withStyles(styles)(PolygonPlain) as ComponentType<PolygonProps>;
