// @flow
import React, { useState } from 'react';
import i18n from '@dhis2/d2-i18n';
import { Modal, ModalTitle, ModalContent, ModalActions, Button, ButtonStrip } from '@dhis2/ui';
import { Map, TileLayer, Marker, FeatureGroup } from 'react-leaflet';
import { EditControl } from 'react-leaflet-draw';
import { withStyles } from '@material-ui/core';
import { dataElementTypes } from '../../metaData';

const styles = () => ({
    modalContent: {
        width: '100%',
        height: '75vh',
    },
    map: {
        width: '100%',
        height: '100%',
    },
    title: {
        textTransform: 'capitalize',
    },
});

type Props = {
    center: ?[number, number],
    isOpen: boolean,
    type: string,
    setOpen: (open: boolean) => void,
    onSetCoordinates: (coordinates: ?[number, number] | ?Array<[number, number]>) => void,
    classes: Object
}

const MapCoordinatesModalPlain = ({ classes, center, isOpen, setOpen, type, onSetCoordinates }: Props) => {
    const [position, setPosition] = useState(null);
    const [coordinates, setCoordinates] = useState(null);

    const onHandleMapClicked = (mapCoordinates) => {
        if (type === dataElementTypes.COORDINATE) {
            const { lat, lng } = mapCoordinates.latlng;
            const pos: [number, number] = [lat, lng];
            setPosition(pos);
        }
    };

    const onMapPolygonCreated = (e: any) => {
        const polygonCoordinates = e.layer.toGeoJSON().geometry.coordinates;
        setCoordinates(polygonCoordinates);
    };

    const onMapPolygonEdited = (e: any) => {
        const polygonCoordinates = e.layers.getLayers()[0].toGeoJSON().geometry.coordinates;
        setCoordinates(polygonCoordinates);
    };
    const onMapPolygonDelete = () => {
        setCoordinates(null);
    };

    const renderMap = () => (<Map
        center={center}
        zoom={13}
        ref={(ref) => {
            if (ref?.leafletElement) {
                setTimeout(() => { ref.leafletElement.invalidateSize(); }, 250);
            }
        }}
        className={classes.map}
        onClick={onHandleMapClicked}
    >
        <TileLayer
            url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"
            attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
        />
        {type === dataElementTypes.POLYGON && <FeatureGroup>
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
        </FeatureGroup>}
        {type === dataElementTypes.COORDINATE && position && <Marker position={position} />}
    </Map>);

    const getTitle = () => {
        switch (type) {
        case dataElementTypes.COORDINATE:
            return i18n.t('coordinates');
        case dataElementTypes.POLYGON:
            return i18n.t('area');
        default:
            console.error(`${type} is not handled`);
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
            onClick={() => {
                onSetCoordinates(position ?? coordinates);
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
                <div className={classes.title}>{getTitle()}</div>
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
