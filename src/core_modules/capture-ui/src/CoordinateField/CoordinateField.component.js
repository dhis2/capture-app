// @flow
import React, { Component } from 'react';
import classNames from 'classnames';
import AddLocationIcon from '../Icons/AddLocationIcon.component';
import { Map, TileLayer, Marker } from 'react-leaflet';
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

export default class D2Coordinate extends Component<Props, State> {
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

    onMapClick = ({ latlng: { lat, lng } }: MapCoordinate) => {
        this.toggleMap();
        this.props.onBlur({ latitude: lat, longitude: lng });
    }

    getPosition = () => {
        const { value } = this.props;
        let convertedValue = null;
        if (value && value.latitude && value.longitude && !isNaN(parseFloat(value.latitude)) && !isNaN(parseFloat(value.longitude))) {
            convertedValue = [parseFloat(value.latitude), parseFloat(value.longitude)];
        }
        return convertedValue;
    }

    render() {
        const { mapCenter, onBlur, onChange, value, orientation, shrinkDisabled, classes, ...passOnProps } = this.props;
        const { mapIconContainer: mapIconContainerCustomClass, mapIcon: mapIconCustomClass, ...passOnClasses } = classes;

        const position = this.getPosition();
        const center = position || mapCenter;
        const coordinateFieldsClass = orientation === orientations.VERTICAL ? defaultClasses.coordinateFieldsVertical : defaultClasses.coordinateFieldsHorizontal;
        const clearIconClass = shrinkDisabled ? defaultClasses.clearIcon : defaultClasses.clearIconWithMargin;
        const mapIconContainerClass = shrinkDisabled ? defaultClasses.mapIconContainer : defaultClasses.mapIconContainerWithMargin;
        return (
            <div className={coordinateFieldsClass}>
                <div className={classNames(mapIconContainerClass, mapIconContainerCustomClass)}>
                    <AddLocationIcon onClick={this.toggleMap} className={classNames(defaultClasses.mapIcon, mapIconCustomClass)} />
                    {
                        this.state.showMap && (
                            <div className={defaultClasses.coordinateLeafletMap} ref={this.onSetMapInstance}>
                                <Map center={center} zoom={13} onClick={this.onMapClick} className={defaultClasses.leafletContainer}>
                                    <TileLayer
                                        url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"
                                        attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
                                    />
                                    {position && <Marker position={position} />}
                                </Map>
                            </div>
                        )
                    }
                </div>
                <div className={defaultClasses.inputContainer}>
                    <CoordinateInput
                        shrinkDisabled={shrinkDisabled}
                        label="Latitude"
                        classes={passOnClasses}
                        className={defaultClasses.latitudeTextInput}
                        value={value && value.latitude}
                        onBlur={latValue => this.handleBlur(coordinateKeys.LATITUDE, latValue)}
                        onChange={latValue => this.handleChange(coordinateKeys.LATITUDE, latValue)}
                        {...passOnProps}
                    />
                </div>
                <div className={defaultClasses.inputContainer}>
                    <CoordinateInput
                        shrinkDisabled={shrinkDisabled}
                        label="Longitude"
                        classes={passOnClasses}
                        className={defaultClasses.longitudeTextInput}
                        value={value && value.longitude}
                        onBlur={lngValue => this.handleBlur(coordinateKeys.LONGITUDE, lngValue)}
                        onChange={lngValue => this.handleChange(coordinateKeys.LONGITUDE, lngValue)}
                        {...passOnProps}
                    />
                </div>
                <div className={clearIconClass}>
                    <ClearIcon onClick={this.handleClear} />
                </div>
            </div>
        );
    }
}
