// @flow
import React, { Component } from 'react';
import LocationIcon from '@material-ui/icons/LocationOn';
import { Map, TileLayer, Marker } from 'react-leaflet';
import ClearIcon from '@material-ui/icons/Clear';
import CoordinateInput from '../internal/CoordinateInput/CoordinateInput.component';
import defaultClasses from '../../d2Ui/coordinateField/coordinateField.mod.css';
import orientations from '../constants/orientations.const';

type Props = {
  onBlur: (value: string, event: UiEventData) => void,
  orientation: $Values<typeof orientations>,
  mapCenter: Array<number>,
};
type State = {
    showMap: ?boolean,
}

const coordinateKeys = {
    LATITUDE: 'latitude',
    LONGITUDE: 'longitude',
};

export default class D2Coordinate extends Component<Props, State> {
    static defaultProps = {
        mapCenter: [51.505, -0.09],
    };
    constructor(props) {
        super(props);

        this.state = {
            showMap: false,
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
        this.props.onChange({ ...this.props.value, [key]: value });
    }

    handleClear = () => {
        this.props.onBlur(null);
    }

    onLocationIconClick = () => {
        this.setState({ showMap: !this.state.showMap });
    }

    onMapClick = ({ latlng: { lat, lng } }) => {
        this.setState({
            showMap: false,
        });
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
        const { mapCenter, onBlur, onChange, label, value, orientation, shrinkDisabled, ...passOnProps } = this.props;

        const position = this.getPosition();
        const center = position || mapCenter;
        const coordinateFieldsClass = orientation === orientations.VERTICAL ? defaultClasses.coordinateFieldsVertical : defaultClasses.coordinateFieldsHorizontal;
        const coordinateIconClass = shrinkDisabled ? defaultClasses.coordinateIcon : defaultClasses.coordinateIconWithMargin;

        return (
            <div className={coordinateFieldsClass}>
                <div className={coordinateIconClass}>
                    <LocationIcon onClick={this.onLocationIconClick} />
                    {
                        this.state.showMap && (
                            <div className={defaultClasses.coordinateLeafletMap}>
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
                        value={value && value.longitude}
                        onBlur={lngValue => this.handleBlur(coordinateKeys.LONGITUDE, lngValue)}
                        onChange={lngValue => this.handleChange(coordinateKeys.LONGITUDE, lngValue)}
                        {...passOnProps}
                    />
                </div>
                <div className={coordinateIconClass}>
                    <ClearIcon onClick={this.handleClear} />
                </div>
            </div>
        );
    }
}
