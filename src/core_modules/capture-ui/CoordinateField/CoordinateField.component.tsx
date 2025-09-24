import React from 'react';
import { cx } from '@emotion/css';
import i18n from '@dhis2/d2-i18n';
import { Map, TileLayer, Marker, withLeaflet } from 'react-leaflet';
import { ReactLeafletSearch } from 'react-leaflet-search-unpolyfilled';
import { IconCross24, Button, ModalActions, ModalContent } from '@dhis2/ui';
import { IconButton } from 'capture-ui';
import { AddLocationIcon } from '../Icons';
import { CoordinateInput } from '../internal/CoordinateInput/CoordinateInput.component';
import defaultClasses from './coordinateField.module.css';
import { orientations } from '../constants/orientations.const';
import type { PlainProps, State } from './CoordinateField.types';

const WrappedLeafletSearch = withLeaflet(ReactLeafletSearch);

const coordinateKeys = {
    LATITUDE: 'latitude',
    LONGITUDE: 'longitude',
};

export class CoordinateField extends React.Component<PlainProps, State> {
    mapInstance: any;
    constructor(props: PlainProps) {
        super(props);

        this.state = {
            showMap: false,
            zoom: 13,
        };
    }

    componentDidUpdate() {
        if (this.mapInstance && this.state.showMap) {
            this.mapInstance.leafletElement.invalidateSize();
        }
    }

    onMapPositionChange = (mapCoordinates: any) => {
        const { lat, lng } = mapCoordinates.latlng;
        this.setMapPosition([this.toSixDecimal(lat), this.toSixDecimal(lng)], mapCoordinates.target.getZoom());
    }

    onSetCoordinate = () => {
        const position = this.state.position;
        const value = position && position.length === 2 ? {
            latitude: position[0],
            longitude: position[1],
        } : null;
        this.props.onBlur(value);
        this.setState({ showMap: false });
    }

    setMapPosition = (position: Array<any>, zoom: number) => {
        this.setState({ position, zoom });
    }

    getPosition = (): Array<number> | null => {
        const { value } = this.props;
        let convertedValue: Array<number> | null = null;
        if (value?.latitude && value?.longitude && !isNaN(parseFloat(value.latitude)) && !isNaN(parseFloat(value.longitude))) {
            convertedValue = [parseFloat(value.latitude), parseFloat(value.longitude)];
        }
        return convertedValue;
    }

    setMapInstance = (mapInstance: any) => {
        this.mapInstance = mapInstance;
    }

    openMap = () => {
        this.props.onOpenMap?.(Boolean(this.props.value));
        this.setState({ showMap: true, position: this.getPosition() });
    }

    closeMap = () => {
        this.props.onCloseMap?.();
        this.setState({ showMap: false });
    }

    toSixDecimal = (value: string) => (parseFloat(value) ? parseFloat(value).toFixed(6) : null)

    handleBlur = (key: string, value: any) => {
        const newValue = { ...this.props.value, [key]: this.toSixDecimal(value) };
        if (!newValue.latitude && !newValue.longitude) {
            this.props.onBlur(null);
            return;
        }
        this.props.onBlur(newValue);
    }

    handleChange = (key: string, value: any) => {
        this.props.onChange?.({ ...this.props.value, [key]: value });
    }

    handleClear = () => {
        this.props.onBlur(null);
    }

    search = (position: any) => {
        const zoom = this.mapInstance?.leafletElement ? this.mapInstance.leafletElement.getZoom() : 13;
        this.setMapPosition([...position], zoom);
    }

    renderMapDialog = () => {
        const clonedDialog = React.cloneElement(

            this.props.mapDialog,
            { hide: !this.state.showMap, onClose: this.closeMap },

            [...React.Children.toArray(this.props.mapDialog.props.children), (
                <>
                    <ModalContent className={defaultClasses.dialogContent} key="dialogContent">
                        {this.renderMap()}
                    </ModalContent>
                    {this.renderDialogActions()}
                </>
            )],
        );
        return clonedDialog;
    }

    renderMapIcon = () => {
        const { classes, shrinkDisabled, disabled } = this.props;
        const { mapIconContainer: mapIconContainerCustomClass, mapIcon: mapIconCustomClass, mapIconContainerDisabled: mapIconContainerDisabledCustomClass } = classes || {};
        const mapIconContainerClass = cx(
            { [defaultClasses.mapIconContainer]: shrinkDisabled },
            { [defaultClasses.mapIconContainerWithMargin]: !shrinkDisabled },
            mapIconContainerCustomClass,
            { [mapIconContainerDisabledCustomClass]: disabled },
        );
        return (
            <div className={mapIconContainerClass}>
                <IconButton
                    disabled={!!disabled}
                    dataTest="mapIconButton"
                    style={{ height: 42, width: 42, borderRadius: 0, padding: 0 }}
                    className={cx(defaultClasses.mapIcon, mapIconCustomClass)}
                    onClick={this.openMap}
                >
                    <AddLocationIcon />
                </IconButton>

            </div>
        );
    }

    renderMap = () => {
        const { position, zoom, showMap } = this.state;
        if (!showMap || (!position && !this.props.center)) {
            return null;
        }
        const center = position || this.props.center;
        return (
            <div className={defaultClasses.mapContainer}>
                <Map
                    center={center}
                    zoom={zoom}
                    onClick={this.onMapPositionChange}
                    className={defaultClasses.leafletContainer}
                    key="map"
                    ref={(mapInstance) => { this.setMapInstance(mapInstance); }}
                >
                    <WrappedLeafletSearch position="topleft" inputPlaceholder="Search" closeResultsOnClick search={null} mapStateModifier={this.search} showMarker={false} />
                    <TileLayer
                        url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"
                        attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
                    />
                    {position && <Marker position={position} />}
                </Map>
            </div>
        );
    }

    renderDialogActions = () => (
        <ModalActions>
            <div className={defaultClasses.dialogActionInnerContainer}>
                <Button secondary onClick={this.closeMap}>
                    {i18n.t('Cancel')}
                </Button>
            </div>
            <div className={defaultClasses.dialogActionInnerContainer}>
                <Button primary onClick={this.onSetCoordinate}>
                    {i18n.t('Set coordinate')}
                </Button>
            </div>
        </ModalActions>
    );

    renderLatitude = () => {
        const { center, onBlur, onChange, value, orientation, shrinkDisabled, classes, mapDialog, disabled, ...passOnProps } = this.props;
        const { mapIconContainer: mapIconContainerCustomClass, mapIcon: mapIconCustomClass, ...passOnClasses } = classes || {};
        return (
            <CoordinateInput
                shrinkDisabled={shrinkDisabled}
                label="Latitude"
                value={value?.latitude}
                classes={passOnClasses}
                className={defaultClasses.latitudeTextInput}
                onBlur={latValue => this.handleBlur(coordinateKeys.LATITUDE, latValue)}
                onChange={latValue => this.handleChange(coordinateKeys.LATITUDE, latValue)}
                disabled={disabled}
                {...passOnProps}
            />
        );
    }

    renderLongitude = () => {
        const { center, onBlur, onChange, value, orientation, shrinkDisabled, classes, mapDialog, disabled, ...passOnProps } = this.props;
        const { mapIconContainer: mapIconContainerCustomClass, mapIcon: mapIconCustomClass, ...passOnClasses } = classes || {};
        return (
            <CoordinateInput
                shrinkDisabled={shrinkDisabled}
                label="Longitude"
                value={value?.longitude}
                className={defaultClasses.longitudeTextInput}
                classes={passOnClasses}
                onBlur={lngValue => this.handleBlur(coordinateKeys.LONGITUDE, lngValue)}
                onChange={lngValue => this.handleChange(coordinateKeys.LONGITUDE, lngValue)}
                disabled={disabled}
                {...passOnProps}
            />
        );
    }

    renderClearButton = () => {
        const { disabled } = this.props;
        return (
            <IconButton
                className={defaultClasses.clearIcon}
                disabled={!!disabled}
                onClick={this.handleClear}
            >
                <IconCross24 />
            </IconButton>
        );
    }


    renderVertical = () => (
        <div>
            <div className={defaultClasses.coordinateFieldsVertical}>
                {this.renderMapDialog()}
                <div className={defaultClasses.buttonsContainerVertical}>
                    {this.renderMapIcon()}
                    {this.renderClearButton()}
                </div>
                <div className={defaultClasses.inputContainer}>
                    {this.renderLatitude()}
                </div>
                <div className={defaultClasses.inputContainer}>
                    {this.renderLongitude()}
                </div>
            </div>
        </div>
    )

    renderHorizontal = () => (
        <div>
            <div className={defaultClasses.coordinateFieldsHorizontal}>
                {this.renderMapDialog()}
                {this.renderMapIcon()}
                <div className={defaultClasses.inputContainer}>
                    {this.renderLatitude()}
                </div>
                <div className={defaultClasses.inputContainer}>
                    {this.renderLongitude()}
                </div>
                {this.renderClearButton()}
            </div>
        </div>
    )

    render() {
        return this.props.orientation === orientations.VERTICAL ? this.renderVertical() : this.renderHorizontal();
    }
}
