import React, { useState, useMemo, type ComponentType } from 'react';
import { cx } from '@emotion/css';
import i18n from '@dhis2/d2-i18n';
import { IconCross24, spacers, Modal, ModalTitle, ModalContent, ModalActions, Button, ButtonStrip } from '@dhis2/ui';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import { ReactLeafletSearch } from 'react-leaflet-search-unpolyfilled';
import { Map, TileLayer, Marker, withLeaflet } from 'react-leaflet';
import { isLangRtl } from 'capture-ui';
import { withStyles, type WithStyles } from 'capture-core-utils/styles';
import { CoordinateInput } from 'capture-ui/internal/CoordinateInput/CoordinateInput.component';
import type { CoordinatesProps } from './Coordinates.types';
import { isEqual } from '../../../../utils/valueEqualityChecker';
import { isValidCoordinate } from './coordinate.validator';
import { convertCoordinatesToServer } from './converters';

const styles = (theme: any) => ({
    modalContent: {
        width: '100%',
    },
    map: {
        width: '100%',
        height: 'calc(100vh - 380px)',
    },
    inputWrapper: {
        paddingTop: spacers.dp8,
        display: 'flex',
    },
    inputContent: {
        flexGrow: 1,
    },
    fieldButton: {
        height: '40px',
        width: '40px',
        borderRadius: '0',
    },
    errorContainer: {
        backgroundColor: theme.palette.error.lighter,
        color: theme.palette.error.main,
    },
});

type Props = CoordinatesProps & WithStyles<typeof styles>;

const WrappedLeafletSearch = withLeaflet(ReactLeafletSearch);

const CoordinatesPlain = ({
    classes,
    center: initialCenter,
    setOpen,
    defaultValues,
    onSetCoordinates,
}: Props) => {
    const [position, setPosition] = useState<[number, number] | null>(defaultValues || null);
    const [center, setCenter] = useState<[number, number] | undefined>(undefined);
    const [tempLatitude, setTempLatitude] = useState<number | undefined>(position?.[0]);
    const [tempLongitude, setTempLongitude] = useState<number | undefined>(position?.[1]);
    const [isEditing, setEditing] = useState(!defaultValues);
    const [isValid, setValid] = useState(true);
    const hasErrors = useMemo(() => {
        const changed = !isEqual(position, defaultValues);
        return changed && !isValid;
    }, [position, defaultValues, isValid]);

    const resetToDefaultValues = () => {
        setCenter(initialCenter || undefined);
        setPosition(defaultValues || null);
        if (defaultValues) {
            setTempLatitude(defaultValues[0]);
            setTempLongitude(defaultValues[1]);
            setEditing(false);
        } else {
            setTempLatitude(undefined);
            setTempLongitude(undefined);
        }
    };

    const onHandleMapClicked = (mapCoordinates: { latlng: { lat: number; lng: number } }) => {
        if (isEditing) {
            const { lat, lng } = mapCoordinates.latlng;
            const newPosition: [number, number] = [lat, lng];
            setValid(true);
            setPosition(newPosition);
            setTempLatitude(lat);
            setTempLongitude(lng);
        }
    };

    const onSearch = (searchPosition: [number, number]) => {
        setCenter(searchPosition);
        setValid(true);
        setTempLatitude(searchPosition[0]);
        setTempLongitude(searchPosition[1]);
        setPosition(searchPosition);
    };

    const renderMap = () => (
        <Map
            center={center ?? initialCenter}
            zoom={13}
            ref={(ref) => {
                if (ref?.leafletElement) {
                    ref.leafletElement.invalidateSize();
                }
            }}
            className={classes.map}
            onClick={onHandleMapClicked}
        >
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
            {position && <Marker position={position} />}
        </Map>
    );

    const renderLatitude = () => (
        <CoordinateInput
            label={i18n.t('Latitude')}
            value={tempLatitude}
            classes={classes}
            disabled={!isEditing}
            onBlur={(latitude) => {
                if (!latitude) {
                    return;
                }
                const longitude = tempLongitude || (position?.[1] ? position[1] : undefined);
                if (!longitude) {
                    return;
                }
                if (!isValidCoordinate({ longitude: Number(longitude), latitude: Number(latitude) })) {
                    setPosition(null);
                    setValid(false);
                    return;
                }
                setValid(true);
                const newPosition: [number, number] = [Number(latitude), Number(longitude)];
                setPosition(newPosition);
                setCenter(newPosition);
            }}
            onChange={(latitude) => {
                setTempLatitude(latitude);
            }}
        />
    );

    const renderLongitude = () => (
        <CoordinateInput
            label={i18n.t('Longitude')}
            value={tempLongitude}
            classes={classes}
            disabled={!isEditing}
            onBlur={(longitude) => {
                if (!longitude) {
                    return;
                }
                const latitude = tempLatitude || (position?.[1] ? position[0] : undefined);
                if (!latitude) {
                    return;
                }
                if (!isValidCoordinate({ longitude: Number(longitude), latitude: Number(latitude) })) {
                    setPosition(null);
                    setValid(false);
                    return;
                }
                setValid(true);
                const newPosition: [number, number] = [Number(latitude), Number(longitude)];
                setPosition(newPosition);
                setCenter(newPosition);
            }}
            onChange={(longitude) => {
                setTempLongitude(longitude);
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
                    icon={<IconCross24 />}
                    onClick={() => {
                        setValid(true);
                        setPosition(null);
                        setTempLatitude(undefined);
                        setTempLongitude(undefined);
                    }}
                />
            )}
        </div>
    );

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
                disabled={hasErrors}
                onClick={() => {
                    const clientValue = [position];
                    const convertedCoordinates = convertCoordinatesToServer(clientValue);
                    onSetCoordinates(convertedCoordinates);
                    setOpen(false);
                    setEditing(false);
                }}
                primary
            >
                {i18n.t('Set coordinates')}
            </Button>
        </ButtonStrip>
    );

    return (
        <Modal large>
            <ModalTitle>{i18n.t('Coordinates')}</ModalTitle>
            <ModalContent className={classes.modalContent}>
                {renderMap()}
                <div className={cx({ [classes.errorContainer]: hasErrors })}>
                    <div className={classes.inputWrapper}>
                        <div className={classes.inputContent}>{renderLatitude()}</div>
                        <div className={classes.inputContent}>{renderLongitude()}</div>
                        {renderFieldButton()}
                    </div>
                    {hasErrors && (
                        <div className={classes.inputWrapper}>{i18n.t('Please provide valid coordinates')}</div>
                    )}
                </div>
            </ModalContent>
            <ModalActions>{renderActions()}</ModalActions>
        </Modal>
    );
};

export const Coordinates = withStyles(styles)(CoordinatesPlain) as ComponentType<CoordinatesProps>;
