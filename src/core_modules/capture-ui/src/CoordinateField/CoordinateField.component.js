// @flow
import * as React from 'react';
import classNames from 'classnames';
import i18n from '@dhis2/d2-i18n';
import { Map, TileLayer, Marker } from 'react-leaflet';
import { ReactLeafletSearch } from 'react-leaflet-search';
import ClearIcon from '@material-ui/icons/Clear';
import IconButton from '@material-ui/core/IconButton';
import AddLocationIcon from '../Icons/AddLocationIcon.component';
import CoordinateInput from '../internal/CoordinateInput/CoordinateInput.component';
import defaultClasses from './coordinateField.mod.css';
import orientations from '../constants/orientations.const';
import Button from '../Buttons/Button.component';


type Coordinate = {
    latitude?: ?string,
    longitude?: ?string,
}

type Props = {
  onBlur: (value: any) => void,
  orientation: $Values<typeof orientations>,
  mapCenter: Array<number>,
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

export default class D2Coordinate extends React.Component<Props, State> {
    static defaultProps = {
        mapCenter: [51.505, -0.09],
    };
    mapInstance: ?any;

    constructor(props: Props) {
        super(props);

        this.state = {
            showMap: false,
            zoom: 13,
        };
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
                    style={{ height: 42, width: 42, borderRadius: 0 }}
                    classes={{ root: classNames(defaultClasses.mapIcon, mapIconCustomClass) }}
                >
                    <AddLocationIcon
                        onClick={this.openMap}
                        
                    />
                </IconButton>

            </div>
        );
    }

    renderMapDialog = () => {
        const clonedDialog = React.cloneElement(
            // $FlowSuppress
            this.props.mapDialog,
            { open: this.state.showMap, onClose: this.closeMap },
            // $FlowSuppress
            [...React.Children.toArray(this.props.mapDialog.props.children), (
                <div className={defaultClasses.dialogContent} key="dialogContent">
                    {this.renderMap()}
                    {this.renderDialogActions()}
                </div>
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
        const center = position || this.props.mapCenter;
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
                    <ReactLeafletSearch position="topleft" inputPlaceholder="Search" closeResultsOnClick search={null} mapStateModifier={this.search} showMarker={false} />
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
        <div className={defaultClasses.dialogActionOuterContainer}>
            <div className={defaultClasses.dialogActionInnerContainer}>
                <Button kind="basic" onClick={this.closeMap}>
                    {i18n.t('Cancel')}
                </Button>
            </div>
            <div className={defaultClasses.dialogActionInnerContainer}>
                <Button kind="primary" onClick={this.onSetCoordinate}>
                    {i18n.t('Set coordinate')}
                </Button>
            </div>
        </div>
    );

    renderLatitude = () => {
        const { mapCenter, onBlur, onChange, value, orientation, shrinkDisabled, classes, mapDialog, disabled, ...passOnProps } = this.props;
        const { mapIconContainer: mapIconContainerCustomClass, mapIcon: mapIconCustomClass, ...passOnClasses } = classes || {};
        return (
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
        const { mapCenter, onBlur, onChange, value, orientation, shrinkDisabled, classes, mapDialog, disabled, ...passOnProps } = this.props;
        const { mapIconContainer: mapIconContainerCustomClass, mapIcon: mapIconCustomClass, ...passOnClasses } = classes || {};
        return (
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
                <IconButton style={{ height: 42, width: 42, borderRadius: 0 }} disabled={!!disabled}>
                    <ClearIcon onClick={this.handleClear} />
                </IconButton>
            </div>

        );
    }


    renderVertical = () => {
        return (
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
        );
    }

    renderHorizontal = () => {
        return (
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
        );
    }

    render() {
        return this.props.orientation === orientations.VERTICAL ? this.renderVertical() : this.renderHorizontal();
    }
}
