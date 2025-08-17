import * as React from 'react';
import i18n from '@dhis2/d2-i18n';
import { Map, TileLayer, Marker } from 'react-leaflet';
import { IconButton } from 'capture-ui';
import { AddLocationIcon } from '../Icons';
import { CoordinateInput } from '../internal/CoordinateInput/CoordinateInput.component';
import defaultClasses from './coordinateField.module.css';
import { orientations } from '../constants/orientations.const';
import type { Props, State, Coordinate } from './CoordinateField.types';

export class CoordinateField extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            mapOpen: false,
            position: [51.505, -0.09],
        };
    }

    onUpdateCoordinate = (coordinate: Coordinate) => {
        this.props.onBlur(coordinate);
    }

    onUpdateLatitude = (latitude: string) => {
        const currentValue = this.props.value || {};
        this.onUpdateCoordinate({
            latitude,
            longitude: currentValue.longitude,
        });
    }

    onUpdateLongitude = (longitude: string) => {
        const currentValue = this.props.value || {};
        this.onUpdateCoordinate({
            latitude: currentValue.latitude,
            longitude,
        });
    }

    onClearCoordinate = () => {
        this.onUpdateCoordinate({
            latitude: '',
            longitude: '',
        });
    }

    onOpenMap = () => {
        this.setState({
            mapOpen: true,
        });
    }

    onCloseMap = () => {
        this.setState({
            mapOpen: false,
        });
    }

    onMapClick = (event: any) => {
        const { lat, lng } = event.latlng;
        this.setState({
            position: [lat, lng],
        });
        this.onUpdateCoordinate({
            latitude: lat.toString(),
            longitude: lng.toString(),
        });
    }

    onSearchResult = (info: any) => {
        const { latLng } = info;
        this.setState({
            position: [latLng.lat, latLng.lng],
        });
        this.onUpdateCoordinate({
            latitude: latLng.lat.toString(),
            longitude: latLng.lng.toString(),
        });
    }

    renderMap() {
        const { mapHeight, mapWidth } = this.props;
        const { position } = this.state;

        return (
            <div className={defaultClasses.mapContainer}>
                <Map
                    center={position}
                    zoom={13}
                    style={{ height: mapHeight, width: mapWidth }}
                    onClick={this.onMapClick}
                >
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    />
                    <Marker position={position} />
                </Map>
                <div className={defaultClasses.mapActions}>
                    <IconButton onClick={this.onCloseMap}>
                        {i18n.t('Close')}
                    </IconButton>
                </div>
            </div>
        );
    }

    renderVertical() {
        const {
            value,
            classes,
            disabled,
            latitudeLabel = i18n.t('Latitude'),
            longitudeLabel = i18n.t('Longitude'),
            innerMessage,
            ...passOnProps
        } = this.props;
        const { mapOpen } = this.state;
        const currentValue = value || {};

        return (
            <div className={defaultClasses.container}>
                <div className={defaultClasses.inputRow}>
                    <CoordinateInput
                        value={currentValue.latitude}
                        onBlur={this.onUpdateLatitude}
                        label={latitudeLabel}
                        classes={classes}
                        disabled={disabled}
                        innerMessage={innerMessage}
                        messageKey="latitude"
                        {...passOnProps as any}
                    />
                </div>
                <div className={defaultClasses.inputRow}>
                    <CoordinateInput
                        value={currentValue.longitude}
                        onBlur={this.onUpdateLongitude}
                        label={longitudeLabel}
                        classes={classes}
                        disabled={disabled}
                        innerMessage={innerMessage}
                        messageKey="longitude"
                        {...passOnProps as any}
                    />
                </div>
                <div className={defaultClasses.buttonRow}>
                    <IconButton
                        className={defaultClasses.clearButton}
                        disabled={disabled}
                        onClick={this.onClearCoordinate}
                    >
                        {i18n.t('Clear')}
                    </IconButton>
                    <IconButton
                        className={defaultClasses.mapButton}
                        disabled={disabled}
                        onClick={this.onOpenMap}
                    >
                        <AddLocationIcon />
                    </IconButton>
                </div>
                {mapOpen && this.renderMap()}
            </div>
        );
    }

    renderHorizontal() {
        const {
            value,
            classes,
            disabled,
            latitudeLabel = i18n.t('Latitude'),
            longitudeLabel = i18n.t('Longitude'),
            innerMessage,
            ...passOnProps
        } = this.props;
        const { mapOpen } = this.state;
        const currentValue = value || {};

        return (
            <div className={defaultClasses.container}>
                <div className={defaultClasses.inputContainer}>
                    <CoordinateInput
                        value={currentValue.latitude}
                        onBlur={this.onUpdateLatitude}
                        label={latitudeLabel}
                        classes={classes}
                        disabled={disabled}
                        innerMessage={innerMessage}
                        messageKey="latitude"
                        {...passOnProps as any}
                    />
                    <CoordinateInput
                        value={currentValue.longitude}
                        onBlur={this.onUpdateLongitude}
                        label={longitudeLabel}
                        classes={classes}
                        disabled={disabled}
                        innerMessage={innerMessage}
                        messageKey="longitude"
                        {...passOnProps as any}
                    />
                    <div className={defaultClasses.buttonContainer}>
                        <IconButton
                            className={defaultClasses.clearButton}
                            disabled={disabled}
                            onClick={this.onClearCoordinate}
                        >
                            {i18n.t('Clear')}
                        </IconButton>
                        <IconButton
                            className={defaultClasses.mapButton}
                            disabled={disabled}
                            onClick={this.onOpenMap}
                        >
                            <AddLocationIcon />
                        </IconButton>
                    </div>
                </div>
                {mapOpen && this.renderMap()}
            </div>
        );
    }

    render() {
        return this.props.orientation === orientations.VERTICAL ? this.renderVertical() : this.renderHorizontal();
    }
}
