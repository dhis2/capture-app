// @flow
import React, { Component } from 'react';
import MapIcon from '@material-ui/icons/Map';
import CheckIcon from '@material-ui/icons/Check';
import L from 'leaflet';
import { Map, TileLayer, FeatureGroup } from 'react-leaflet';
import { ReactLeafletSearch } from 'react-leaflet-search';
import EditControl from 'react-leaflet-draw/lib/EditControl';
import defaultClasses from './polygonField.mod.css';
import './styles.css';

type Props = {
  onBlur: (value: any) => void,
  value?: ?any,
  mapCenter: Array<number>,
};

type State = {
    showMap: ?boolean,
}

type Feature = {
    type: string,
    properties: Object,
    geometry: {
        type: string,
        coordinates: Array<Array<Array<Number>>>,
    },
}

type FeatureCollection = {
    type: string,
    features: Array<Feature>,
};


function isPointInRect({ x, y }, { left, right, top, bottom }) {
    return x >= left && x <= right && y >= top && y <= bottom;
}

function coordsToFeatureCollection(coordinates): ?FeatureCollection {
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

export default class D2Polygon extends Component<Props, State> {
    static defaultProps = {
        mapCenter: [51.505, -0.09],
    }

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

    toggleMap = () => this.setState({ showMap: !this.state.showMap });

    onEdited = (e: any) => {
        const coordinates = e.layers.toGeoJSON().features[0].geometry.coordinates;
        this.toggleMap();
        this.props.onBlur(coordinates);
    };

    onCreate = (e: any) => {
        const coordinates = e.layer.toGeoJSON().geometry.coordinates;
        this.toggleMap();
        this.props.onBlur(coordinates);
    };

    onDeleted = () => {
        this.props.onBlur(null);
    };

    onFeatureGroupReady = (reactFGref: any, featureCollection: ?FeatureCollection) => {
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

    getCenter = (featureCollection: ?FeatureCollection) => {
        if (!featureCollection) {
            return this.props.mapCenter;
        }
        const coordinates = featureCollection.features[0].geometry.coordinates[0];
        const { lat, lng } = L.latLngBounds(coordinates.map(c => ([c[1], c[0]]))).getCenter();
        return [lng, lat];
    }

    getFeatureCollection = () => (Array.isArray(this.props.value) ? coordsToFeatureCollection(this.props.value) : null)

    render() {
        const featureCollection = this.getFeatureCollection();
        const hasValue = !!featureCollection;
        return (
            <div className={defaultClasses.container}>
                <div className={defaultClasses.statusContainer}>
                    <MapIcon className={defaultClasses.mapIcon} onClick={this.toggleMap} />
                    <div className={defaultClasses.statusText}>
                        {hasValue ? 'Polygon captured' : 'No polygon captured'}
                    </div>
                    { hasValue && <CheckIcon className={defaultClasses.checkIcon} color="primary" /> }
                </div>
                {
                    this.state.showMap && (
                        <div className={defaultClasses.polygonLeafletMap} ref={this.onSetMapInstance}>
                            <Map zoom={13} center={this.getCenter(featureCollection)} zoomControl={false} className={defaultClasses.leafletContainer}>
                                <ReactLeafletSearch position="topleft" inputPlaceholder="Search" closeResultsOnClick />
                                <TileLayer
                                    url="//cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png"
                                    attribution='&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'
                                />
                                <FeatureGroup ref={(reactFGref) => { this.onFeatureGroupReady(reactFGref, featureCollection); }}>
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
