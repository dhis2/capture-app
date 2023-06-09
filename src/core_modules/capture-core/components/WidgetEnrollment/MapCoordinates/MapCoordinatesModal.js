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
import { isEqual } from '../../../utils/valueEqualityChecker';
import { isValidCoordinate } from './coordinate.validator';
import { convertToServerCoordinates } from './convertor';

const styles = (theme: Theme) => ({
    modalContent: {
        width: '100%',
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
    errorContainer: {
        backgroundColor: theme.palette.error.lighter,
        color: theme.palette.error.main,
    },
});

const coordsToFeatureCollection = (inputCoordinates): ?FeatureCollection => {
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

const MapCoordinatesModalPlain = ({
    classes,
    center: initialCenter,
    isOpen,
    setOpen,
    type,
    defaultValues,
    onSetCoordinates,
}: ModalProps) => {
    const isPoint = useMemo(() => type === dataElementTypes.COORDINATE, [type]);
    const [position, setPosition] = useState(isPoint ? defaultValues : null);
    const [coordinates, setCoordinates] = useState(type === dataElementTypes.POLYGON ? defaultValues : null);
    const [center, setCenter] = useState(initialCenter);
    const [tempLat, setLat] = useState(position?.[0]);
    const [tempLng, setLng] = useState(position?.[1]);
    const [isEditing, setEditing] = useState(!(isPoint && defaultValues));
    const [isValid, setValid] = useState(true);
    const hasErrors = useMemo(() => {
        const changed = isPoint ? !isEqual(position, defaultValues) : !isEqual(coordinates, defaultValues);
        return changed && !isValid;
    }, [position, coordinates, defaultValues, isPoint, isValid]);
    const title = useMemo(() => {
        switch (type) {
        case dataElementTypes.COORDINATE:
            return i18n.t('coordinates');
        case dataElementTypes.POLYGON:
            return i18n.t('area');
        default:
            log.error(`${type} is not handled`);
            return '';
        }
    }, [type]);

    const onHandleMapClicked = (mapCoordinates) => {
        if (isPoint && isEditing) {
            const { lat, lng } = mapCoordinates.latlng;
            const newPosition: [number, number] = [lat, lng];
            setValid(true);
            setPosition(newPosition);
            setLat(lat);
            setLng(lng);
        }
    };

    const onMapPolygonCreated = (e: any) => {
        const polygonCoordinates = e.layer.toGeoJSON().geometry.coordinates[0].map(c => [c[1], c[0]]);
        setCoordinates(polygonCoordinates);
    };

    const onMapPolygonEdited = (e: any) => {
        const polygonCoordinates = e.layers
            .getLayers()[0]
            .toGeoJSON()
            .geometry.coordinates[0].map(c => [c[1], c[0]]);
        setCoordinates(polygonCoordinates);
    };

    const onMapPolygonDelete = () => {
        setCoordinates(null);
    };

    const onSearch = (searchPosition: any) => {
        setCenter(searchPosition);
        if (isPoint) {
            setValid(true);
            setLat(searchPosition[0]);
            setLng(searchPosition[1]);
            setPosition(searchPosition);
        }
    };

    const getFeatureCollection = () => (Array.isArray(coordinates) ? coordsToFeatureCollection(coordinates) : null);

    const renderMap = () => (
        <Map
            center={center}
            zoom={13}
            ref={(ref) => {
                if (ref?.leafletElement) {
                    ref.leafletElement.invalidateSize();
                    if (ref.contextValue && type === dataElementTypes.POLYGON && coordinates) {
                        const { map } = ref.contextValue;
                        map?.fitBounds(coordinates);
                    }
                }
            }}
            className={classes.map}
            onClick={onHandleMapClicked}
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
            {type === dataElementTypes.POLYGON && (
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
                    />
                </FeatureGroup>
            )}
            {isPoint && position && <Marker position={position} />}
        </Map>
    );

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

    const renderLatitude = () => (
        <CoordinateInput
            label={i18n.t('Latitude')}
            value={tempLat}
            classes={classes}
            disabled={!isEditing}
            onBlur={(latValue) => {
                if (!latValue) {
                    return;
                }
                const lngValue = tempLng || (position?.[1] ? position[1] : undefined);
                if (!lngValue) {
                    return;
                }
                if (!isValidCoordinate({ longitude: Number(latValue), latitude: lngValue })) {
                    setPosition(null);
                    setValid(false);
                    return;
                }
                setValid(true);
                const newPosition = [Number(latValue), lngValue];
                setPosition(newPosition);
                setCenter(newPosition);
            }}
            onChange={(latValue) => {
                setLat(latValue);
            }}
        />
    );

    const renderLongitude = () => (
        <CoordinateInput
            label={i18n.t('Longitude')}
            value={tempLng}
            classes={classes}
            disabled={!isEditing}
            onBlur={(lngValue) => {
                if (!lngValue) {
                    return;
                }
                const latValue = tempLat || (position?.[1] ? position[0] : undefined);
                if (!latValue) {
                    return;
                }
                if (!isValidCoordinate({ longitude: latValue, latitude: Number(lngValue) })) {
                    setPosition(null);
                    setValid(false);
                    return;
                }
                setValid(true);
                const newPosition = [latValue, Number(lngValue)];
                setPosition(newPosition);
                setCenter(newPosition);
            }}
            onChange={(lngValue) => {
                setLng(lngValue);
            }}
        />
    );

    const renderFieldButton = () => (
        <div>
            {!isEditing ? (
                <Button
                    className={classes.fieldButton}
                    primary
                    onClick={() => {
                        setEditing(true);
                    }}
                >
                    {i18n.t('Edit')}
                </Button>
            ) : (
                <Button
                    className={classes.fieldButton}
                    disabled={!position && isValid}
                    icon={<IconCross24 />}
                    onClick={() => {
                        setPosition(null);
                        setLat(null);
                        setLng(null);
                    }}
                />
            )}
        </div>
    );

    const renderActions = () => (
        <ButtonStrip end>
            <Button
                onClick={() => {
                    setOpen(false);
                    setEditing(false);
                }}
                secondary
            >
                {i18n.t('Cancel')}
            </Button>
            <Button
                disabled={hasErrors}
                onClick={() => {
                    const clientValue = position ? [position] : coordinates;
                    const convertedCoordinates = convertToServerCoordinates(clientValue, type);
                    onSetCoordinates(convertedCoordinates);
                    setOpen(false);
                    setEditing(false);
                }}
                primary
            >
                {`${i18n.t('Set')} ${title}`}
            </Button>
        </ButtonStrip>
    );

    return (
        <Modal hide={!isOpen} large>
            <ModalTitle>{capitalizeFirstLetter(title)}</ModalTitle>
            <ModalContent>
                <div className={classes.modalContent}>
                    {renderMap()}
                    {isPoint && (
                        <div className={hasErrors && classes.errorContainer}>
                            <div className={classes.inputWrapper}>
                                <div className={classes.inputContent}>{renderLatitude()}</div>
                                <div className={classes.inputContent}>{renderLongitude()}</div>
                                {renderFieldButton()}
                            </div>
                            {hasErrors && (
                                <div className={classes.inputWrapper}>{i18n.t('Please provide valid coordinates')}</div>
                            )}
                        </div>
                    )}
                </div>
            </ModalContent>
            <ModalActions>{renderActions()}</ModalActions>
        </Modal>
    );
};
export const MapCoordinatesModal = withStyles(styles)(MapCoordinatesModalPlain);
