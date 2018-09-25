// @flow
import React, { Component } from 'react';
import FormLabel from '@material-ui/core/FormLabel';
import MapIcon from '@material-ui/icons/Map';
import CheckIcon from '@material-ui/icons/Check';
import L from 'leaflet';
import { Map, TileLayer, FeatureGroup } from 'react-leaflet';
import EditControl from 'react-leaflet-draw/lib/EditControl';

import './styles.css';

type Props = {
  onBlur: (value: string, event: UiEventData) => void,
};

function coordsToFeatureCollection(coordinates) {
    if (!coordinates) {
        return null;
    }

    const list = coordinates[0].map(c => [...c, 0]);
    return {
        type: 'FeatureCollection',
        features: [
            {
                type: 'Feature',
                properties: {},
                geometry: {
                    type: 'Polygon',
                    coordinates: [list],
                },
            },
        ],
    };
}

export default class PolygonField extends Component<Props> {
    constructor(props) {
        super(props);

        const featureCollection = Array.isArray(props.value) ? coordsToFeatureCollection(props.value) : null;
        this.state = {
            featureCollection,
            showMap: false,
        };
    }

    onMapIconClick = () => this.setState({ showMap: !this.state.showMap });

    onEdited = (e) => {
        const coordinates = e.layers.toGeoJSON().features[0].geometry.coordinates;
        this.setState({ featureCollection: coordsToFeatureCollection(coordinates) }, () => {
            this.props.onBlur(coordinates);
        });
    };

    onCreate = (e) => {
        const coordinates = e.layer.toGeoJSON().geometry.coordinates;
        this.setState({ featureCollection: coordsToFeatureCollection(coordinates) }, () => {
            this.props.onBlur(coordinates);
        });
    };

    onDeleted = () => {
        this.setState({ featureCollection: null });
        this.props.onBlur(null);
    };

    onFeatureGroupReady = (reactFGref) => {
        const { featureCollection } = this.state;

        if (featureCollection) {
            const leafletGeoJSON = new L.GeoJSON(featureCollection);
            if (reactFGref) {
                const leafletFG = reactFGref.leafletElement;
                leafletFG.clearLayers();

                leafletGeoJSON.eachLayer((layer) => {
                    leafletFG.addLayer(layer);
                });

                const { map } = reactFGref.context;
                const coordinates = featureCollection.features[0].geometry.coordinates[0];
                map.fitBounds(coordinates.map(c => ([c[1], c[0]])));
            }
        }
    };

    getCenter() {
        const { featureCollection } = this.state;
        if (!featureCollection) {
            return [51.505, -0.09];
        }

        const coordinates = featureCollection.features[0].geometry.coordinates[0];
        const { lat, lng } = L.latLngBounds(coordinates.map(c => ([c[1], c[0]]))).getCenter();
        return [lng, lat];
    }

    render() {
        const captured = this.state.featureCollection !== null;
        return (
            <div className="polygon-field">
                <div className="polygon-label">
                    <FormLabel
                        component="label"
                        required={!!this.props.required}
                        focused={false}
                    >
                        {this.props.label}
                    </FormLabel>
                </div>
                <div className="polygon-field-status">
                    <MapIcon onClick={this.onMapIconClick} />
                    <div className="polygon-status">{captured ? 'Polygon captured' : 'No polygon captured'}</div>
                    { captured && <CheckIcon color="primary" /> }
                </div>
                {
                    this.state.showMap && (
                        <div className="polygon-container">
                            <Map zoom={13} center={this.getCenter()} zoomControl={false}>
                                <TileLayer
                                    url="//cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png"
                                    attribution='&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'
                                />
                                <FeatureGroup ref={(reactFGref) => { this.onFeatureGroupReady(reactFGref); }}>
                                    <EditControl
                                        position="topright"
                                        onEdited={this.onEdited}
                                        onCreated={this.onCreate}
                                        onDeleted={this.onDeleted}
                                        draw={{
                                            rectangle: false,
                                            polyline: false,
                                            circle: false,
                                            marker: false,
                                            circlemarker: false,
                                        }}
                                    />
                                </FeatureGroup>
                            </Map>
                        </div>
                    )
                }
            </div>
        );
    }
}
