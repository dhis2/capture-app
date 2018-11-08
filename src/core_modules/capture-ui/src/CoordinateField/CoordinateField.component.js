// @flow
import * as React from 'react';
import classNames from 'classnames';
import AddLocationIcon from '../Icons/AddLocationIcon.component';
import { Map, TileLayer, Marker } from 'react-leaflet';
import { ReactLeafletSearch } from 'react-leaflet-search';
import ClearIcon from '@material-ui/icons/Clear';
import CoordinateInput from '../internal/CoordinateInput/CoordinateInput.component';
import defaultClasses from './coordinateField.mod.css';
import orientations from '../constants/orientations.const';

type Coordinate = {
    latitude?: ?string,
    longitude?: ?string,
}

type MapCoordinate = {
    latlng: {
        lat?: ?string,
        lng?: ?string,
    }
}

type Props = {
  onBlur: (value: any) => void,
  orientation: $Values<typeof orientations>,
  mapCenter: Array<number>,
  onChange?: ?(value: any) => void,
  value?: ?Coordinate,
  shrinkDisabled?: ?boolean,
  classes?: ?Object,
  mapDialog?: ?React.Element<any>,
};
type State = {
    showMap: ?boolean,
}

const coordinateKeys = {
    LATITUDE: 'latitude',
    LONGITUDE: 'longitude',
};

function isPointInRect({ x, y }, { left, right, top, bottom }) {
    return x >= left && x <= right && y >= top && y <= bottom;
}

export default class D2Coordinate extends React.Component<Props, State> {
    static defaultProps = {
        mapCenter: [51.505, -0.09],
    };
    mapInstance: ?HTMLElement;

    constructor(props: Props) {
        super(props);

        this.state = {
            showMap: false,
        };
    }

    componentWillUnmount() {
        document.removeEventListener('click', this.onDocClick);
    }

    onSetMapInstance = (mapInstance: ?HTMLElement) => {
        this.mapInstance = mapInstance;
        if (this.mapInstance) {
            document.addEventListener('click', this.onDocClick);
        } else {
            document.removeEventListener('click', this.onDocClick);
        }
    }

    onDocClick = (event: any) => {
        if (this.mapInstance) {
            const target = { x: event.clientX, y: event.clientY };
            const container = this.mapInstance.getBoundingClientRect();

            if (!isPointInRect(target, container)) {
                this.toggleMap();
            }
        }
    };

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

    toggleMap = () => {
        this.setState({ showMap: !this.state.showMap });
    }

    onMapClick = ({ latlng: { lat, lng } }: MapCoordinate, keepMapOpen: boolean) => {
        if (!keepMapOpen) {
            this.toggleMap();
        }
        this.props.onBlur({ latitude: lat, longitude: lng });
    }

    selectSearchResult = (selectedResult: {latLng: Array<any>}) => {
        const { value } = this.props;
        if ((value && selectedResult.latLng[0] === value.latitude) || (value && selectedResult.latLng[1] === value.longitude)) {
            return;
        }
        this.onMapClick({ latlng: { lat: selectedResult.latLng[0], lng: selectedResult.latLng[1] } }, true);
    }

    getPosition = () => {
        const { value } = this.props;
        let convertedValue = null;
        if (value && value.latitude && value.longitude && !isNaN(parseFloat(value.latitude)) && !isNaN(parseFloat(value.longitude))) {
            convertedValue = [parseFloat(value.latitude), parseFloat(value.longitude)];
        }
        return convertedValue;
    }

    renderAbsoluteMap = () => this.state.showMap && (
        <div className={defaultClasses.coordinateLeafletMap} ref={this.onSetMapInstance}>
            {this.renderMap()}
        </div>
    );

    renderDialogMap = () => {
        const clonedMapDialog = React.cloneElement(
            // $FlowSuppress
            this.props.mapDialog,
            { open: this.state.showMap, onClose: this.toggleMap },
            // $FlowSuppress
            [...React.Children.toArray(this.props.mapDialog.props.children), this.renderMap(true)],
        );
        return clonedMapDialog;
    }

    renderMap = (useDialog?: ?boolean) => {
        const position = this.getPosition();
        const center = position || this.props.mapCenter;
        const leafletContainerClass = useDialog ? defaultClasses.dialogLeafletContainer : defaultClasses.leafletContainer;
        return (
            <Map center={center} zoom={13} onClick={this.onMapClick} className={leafletContainerClass} key="map">
                <ReactLeafletSearch popUp={this.selectSearchResult} position="topleft" inputPlaceholder="Search" closeResultsOnClick />
                <TileLayer
                    url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"
                    attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
                />
                {position && <Marker position={position} />}
            </Map>
        );
    };

    renderAddLocation = (useDialog: boolean) => {
        const { classes, shrinkDisabled } = this.props;
        const { mapIconContainer: mapIconContainerCustomClass, mapIcon: mapIconCustomClass } = classes || {};
        const mapIconContainerClass = shrinkDisabled ?
            defaultClasses.mapIconContainer :
            defaultClasses.mapIconContainerWithMargin;
        return (
            <React.Fragment>
                {
                    useDialog ? this.renderDialogMap() : this.renderAbsoluteMap()
                }
                <div className={classNames(mapIconContainerClass, mapIconContainerCustomClass)}>
                    <AddLocationIcon
                        onClick={this.toggleMap}
                        className={classNames(defaultClasses.mapIcon, mapIconCustomClass)}
                    />
                </div>
            </React.Fragment>
        );
    }

    render() {
        const { mapCenter, onBlur, onChange, value, orientation, shrinkDisabled, classes, mapDialog, ...passOnProps } = this.props;
        const { mapIconContainer: mapIconContainerCustomClass, mapIcon: mapIconCustomClass, ...passOnClasses } = classes || {};
        const useDialog = !!mapDialog;
        const coordinateFieldsClass = orientation === orientations.VERTICAL ? defaultClasses.coordinateFieldsVertical : defaultClasses.coordinateFieldsHorizontal;
        const clearIconClass = shrinkDisabled ? defaultClasses.clearIcon : defaultClasses.clearIconWithMargin;

        return (
            <div>
                <div className={coordinateFieldsClass}>
                    {this.renderAddLocation(useDialog)}
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
