// @flow
import React, { Component } from 'react';
import FormLabel from '@material-ui/core/FormLabel';
import TextField from '@material-ui/core/TextField';
import LocationIcon from '@material-ui/icons/LocationOn';

import './styles.css';

type Props = {
  onBlur: (value: string, event: UiEventData) => void,
};

export default class CoordinateField extends Component<Props> {
    constructor(props) {
        super(props);

        this.state = {
            latitude: typeof props.latitude !== 'undefined' ? props.latitude : '',
            longitude: typeof props.longitude !== 'undefined' ? props.longitude : '',
        };
    }

    handleBlur = () => this.props.onBlur({ ...this.state });

    handleLatitudeChange = evt => this.setState({ latitude: evt.target.value });
    handleLongitudeChange = evt => this.setState({ longitude: evt.target.value });

    render() {
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
                        <LocationIcon />
                    </div>
                    <TextField
                        style={{ marginRight: 10 }}
                        label="Latitude"
                        name="latitude"
                        type="text"
                        onBlur={this.handleBlur}
                        onChange={this.handleLatitudeChange}
                    />
                    <TextField
                        name="longitude"
                        label="Longitude"
                        type="text"
                        onBlur={this.handleBlur}
                        onChange={this.handleLongitudeChange}
                    />
                </div>
            </div>
        );
    }
}
