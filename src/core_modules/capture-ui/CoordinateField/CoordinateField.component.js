// @flow
import * as React from 'react';
import classNames from 'classnames';
import i18n from '@dhis2/d2-i18n';
import { Map, TileLayer, Marker, withLeaflet } from 'react-leaflet';
import { ReactLeafletSearch } from 'react-leaflet-search-unpolyfilled';
import { IconCross24, Button, ModalActions, ModalContent } from '@dhis2/ui';
import { IconButton } from 'capture-ui';
import { AddLocationIcon } from '../Icons';
import { CoordinateInput } from '../internal/CoordinateInput/CoordinateInput.component';
import defaultClasses from './coordinateField.module.css';
import { orientations } from '../constants/orientations.const';

const WrappedLeafletSearch = withLeaflet(ReactLeafletSearch);

type Coordinate = {
    latitude?: ?string,
    longitude?: ?string,
}

type Props = {
  onBlur: (value: any) => void,
  onOpenMap: (hasValue: boolean) => void,
  orientation: $Values<typeof orientations>,
  center?: ?Array<number>,
  onChange?: ?(value: any) => void,
  value?: ?Coordinate,
  shrinkDisabled?: ?boolean,
  classes?: ?Object,
  mapDialog: React.Element<any>,
  disabled?: ?boolean,
};
type State = {
    showMap: ?boolean,
    position?: ?Array<number>,
    zoom: number,
}

const coordinateKeys = {
    LATITUDE: 'latitude',
    LONGITUDE: 'longitude',
};

export class CoordinateField extends React.Component<Props, State> {
    mapInstance: ?any;

    constructor(props: Props) {
        super(props);

        this.state = {
            showMap: false,
            zoom: 13,
        };
    }

    componentDidUpdate() {
        // Invalidate map size to fix rendering bug
        if (this.mapInstance && this.state.showMap) {
            this.mapInstance.leafletElement.invalidateSize();
        }
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
        this.props.onChange && this.props.onChange({ ...this.props.value, [key]: value });
    }

    handleClear = () => {
        this.props.onBlur(null);
    }

    getPosition = () => {
        const { value } = this.props;
        let convertedValue = null;
        if (value && value.latitude && value.longitude && !isNaN(parseFloat(value.latitude)) && !isNaN(parseFloat(value.longitude))) {
            convertedValue = [parseFloat(value.latitude), parseFloat(value.longitude)];
        }
        return convertedValue;
    }

    closeMap = () => {
        this.setState({ showMap: false });
    }

    openMap = () => {
        this.props.onOpenMap(Boolean(this.props.value));
        this.setState({ showMap: true, position: this.getPosition() });
    }

    onMapPositionChange = (mapCoordinates: any) => {
        const { lat, lng } = mapCoordinates.latlng;
        this.setMapPosition([this.toSixDecimal(lat), this.toSixDecimal(lng)], mapCoordinates.target.getZoom());
    }

    setMapPosition = (position: Array<any>, zoom: number) => {
        this.setState({ position, zoom });
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

    renderMapIcon = () => {
        const { classes, shrinkDisabled, disabled } = this.props;
        const { mapIconContainer: mapIconContainerCustomClass, mapIcon: mapIconCustomClass, mapIconContainerDisabled: mapIconContainerDisabledCustomClass } = classes || {};
        const mapIconContainerClass = classNames(
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
                    className={classNames(defaultClasses.mapIcon, mapIconCustomClass)}
                    onClick={this.openMap}
                >
                    <AddLocationIcon />
                </IconButton>

            </div>
        );
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

    setMapInstance = (mapInstance: any) => {
        this.mapInstance = mapInstance;
    }

    search = (position: any) => {
        const zoom = this.mapInstance && this.mapInstance.leafletElement ? this.mapInstance.leafletElement.getZoom() : 13;
        this.setMapPosition([...position], zoom);
    }

    renderMap = () => {
        const { position, zoom } = this.state;
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
        <ModalActions className={defaultClasses.dialogActionOuterContainer}>
            <div className={defaultClasses.dialogActionInnerContainer}>
                {/* $FlowFixMe[prop-missing] automated comment */}
                <Button kind="basic" onClick={this.closeMap}>
                    {i18n.t('Cancel')}
                </Button>
            </div>
            <div className={defaultClasses.dialogActionInnerContainer}>
                {/* $FlowFixMe[prop-missing] automated comment */}
                <Button kind="primary" onClick={this.onSetCoordinate}>
                    {i18n.t('Set coordinate')}
                </Button>
            </div>
        </ModalActions>
    );

    renderLatitude = () => {
        const { center, onBlur, onChange, value, orientation, shrinkDisabled, classes, mapDialog, disabled, ...passOnProps } = this.props;
        const { mapIconContainer: mapIconContainerCustomClass, mapIcon: mapIconCustomClass, ...passOnClasses } = classes || {};
        return (
            // $FlowFixMe[cannot-spread-inexact] automated comment
            <CoordinateInput
                shrinkDisabled={shrinkDisabled}
                label="Latitude"
                value={value && value.latitude}
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
            // $FlowFixMe[cannot-spread-inexact] automated comment
            <CoordinateInput
                shrinkDisabled={shrinkDisabled}
                label="Longitude"
                value={value && value.longitude}
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
        const { shrinkDisabled, disabled } = this.props;
        const clearIconClass = shrinkDisabled ? defaultClasses.clearIcon : defaultClasses.clearIconWithMargin;
        return (
            <div className={clearIconClass}>
                <IconButton style={{ height: 42, width: 42, borderRadius: 0, padding: 0 }} disabled={!!disabled} onClick={this.handleClear}>
                    <IconCross24 />
                </IconButton>
            </div>

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
