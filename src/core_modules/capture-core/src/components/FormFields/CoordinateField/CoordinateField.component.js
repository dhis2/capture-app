// @flow
import React, { Component } from 'react';
import FormLabel from '@material-ui/core/FormLabel';
import TextField from '@material-ui/core/TextField';
import LocationIcon from '@material-ui/icons/LocationOn';
import { Map, TileLayer, Marker } from 'react-leaflet';

import './styles.css';

type Props = {
  onBlur: (value: string, event: UiEventData) => void,
};

export default class CoordinateField extends Component<Props> {
    constructor(props) {
        super(props);

        let latitude = '';
        let longitude = '';

        if (props.value) {
            latitude = typeof props.value.latitude !== 'undefined' ? props.value.latitude : '';
            longitude = typeof props.value.longitude !== 'undefined' ? props.value.longitude : '';
        }

        this.state = {
            latitude,
            longitude,
            showMap: false,
        };
    }

    handleBlur = () => {
        const { latitude, longitude } = this.state;
        if (!latitude && !longitude) {
            this.props.onBlur(null);
        } else {
            this.props.onBlur({ latitude, longitude });
        }
    }

    handleLatitudeChange = evt => this.setState({ latitude: evt.target.value });
    handleLongitudeChange = evt => this.setState({ longitude: evt.target.value });
    onLocationIconClick = () => this.setState({ showMap: !this.state.showMap });

    onMapClick = ({ latlng: { lat, lng } }) => {
        this.setState({
            showMap: false,
            latitude: lat,
            longitude: lng,
        });
        this.props.onBlur({ latitude: lat, longitude: lng });
    }

    render() {
        const { latitude, longitude } = this.state;
        let position = null;
        let center = [51.505, -0.09];
        if (latitude && longitude && !isNaN(parseFloat(latitude)) && !isNaN(parseFloat(longitude))) {
            position = [parseFloat(latitude), parseFloat(longitude)];
            center = position;
        }

        return (
            <div className="coordinate-field">
                <div className="coordinate-label">
                    <FormLabel
                        component="label"
                        required={!!this.props.required}
                        focused={false}
                    >
                        {this.props.label}
                    </FormLabel>
                </div>
                <div className="coordinate-fields">
                    <div className="coordinate-icon">
                        <LocationIcon onClick={this.onLocationIconClick} />
                        {
                            this.state.showMap && (
                                <div className="coordinate-leaflet-map">
                                    <Map center={center} zoom={13} onClick={this.onMapClick}>
                                        <TileLayer
                                            url="//cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png"
                                            attribution='&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'
                                        />
                                        {position && <Marker position={position} />}
                                    </Map>
                                </div>
                            )
                        }
                    </div>
                    <TextField
                        style={{ marginRight: 10 }}
                        label="Latitude"
                        name="latitude"
                        type="text"
                        value={latitude}
                        onBlur={this.handleBlur}
                        onChange={this.handleLatitudeChange}
                    />
                    <TextField
                        name="longitude"
                        label="Longitude"
                        type="text"
                        value={longitude}
                        onBlur={this.handleBlur}
                        onChange={this.handleLongitudeChange}
                    />
                </div>
            </div>
        );
    }
}
