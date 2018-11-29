// @flow
import * as React from 'react';
import classNames from 'classnames';
import i18n from '@dhis2/d2-i18n';
import { Map, TileLayer, Marker } from 'react-leaflet';
import { ReactLeafletSearch } from 'react-leaflet-search';
import ClearIcon from '@material-ui/icons/Clear';
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

    handleBlur = (key: string, value: any) => {
        const newValue = { ...this.props.value, [key]: value };
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
        const latlng = mapCoordinates.latlng;
        this.setMapPosition([latlng.lat, latlng.lng], mapCoordinates.target.getZoom());
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
        const { classes, shrinkDisabled } = this.props;
        const { mapIconContainer: mapIconContainerCustomClass, mapIcon: mapIconCustomClass } = classes || {};
        const mapIconContainerClass = shrinkDisabled ?
            defaultClasses.mapIconContainer :
            defaultClasses.mapIconContainerWithMargin;
        return (
            <div className={classNames(mapIconContainerClass, mapIconContainerCustomClass)}>
                <AddLocationIcon
                    onClick={this.openMap}
                    className={classNames(defaultClasses.mapIcon, mapIconCustomClass)}
                />
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

    render() {
        const { mapCenter, onBlur, onChange, value, orientation, shrinkDisabled, classes, mapDialog, ...passOnProps } = this.props;
        const { mapIconContainer: mapIconContainerCustomClass, mapIcon: mapIconCustomClass, ...passOnClasses } = classes || {};
        const coordinateFieldsClass = orientation === orientations.VERTICAL ? defaultClasses.coordinateFieldsVertical : defaultClasses.coordinateFieldsHorizontal;
        const clearIconClass = shrinkDisabled ? defaultClasses.clearIcon : defaultClasses.clearIconWithMargin;

        return (
            <div>
                <div className={coordinateFieldsClass}>
                    {this.renderMapDialog()}
                    {this.renderMapIcon()}
                    <div className={defaultClasses.inputContainer}>
                        <CoordinateInput
                            shrinkDisabled={shrinkDisabled}
                            label="Latitude"
                            value={value && value.latitude}
                            classes={passOnClasses}
                            className={defaultClasses.latitudeTextInput}
                            onBlur={latValue => this.handleBlur(coordinateKeys.LATITUDE, latValue)}
                            onChange={latValue => this.handleChange(coordinateKeys.LATITUDE, latValue)}
                            {...passOnProps}
                        />
                    </div>
                    <div className={defaultClasses.inputContainer}>
                        <CoordinateInput
                            shrinkDisabled={shrinkDisabled}
                            label="Longitude"
                            value={value && value.longitude}
                            className={defaultClasses.longitudeTextInput}
                            classes={passOnClasses}
                            onBlur={lngValue => this.handleBlur(coordinateKeys.LONGITUDE, lngValue)}
                            onChange={lngValue => this.handleChange(coordinateKeys.LONGITUDE, lngValue)}
                            {...passOnProps}
                        />
                    </div>
                    <div className={clearIconClass}>
                        <ClearIcon onClick={this.handleClear} />
                    </div>
                </div>
            </div>
        );
    }
}
