// @flow
import * as React from 'react';
import i18n from '@dhis2/d2-i18n';
import MapIcon from '@material-ui/icons/Map';
import CheckIcon from '@material-ui/icons/Check';
import L from 'leaflet';
import { Map, TileLayer, FeatureGroup, withLeaflet } from 'react-leaflet';
import { ReactLeafletSearch } from 'react-leaflet-search-unpolyfilled';
import { EditControl } from 'react-leaflet-draw';
import defaultClasses from './polygonField.module.css';
import './styles.css';
import Button from '../Buttons/Button.component';
import DeleteControl from './DeleteControl.component';

const WrappedLeafletSearch = withLeaflet(ReactLeafletSearch);

type Props = {
  onBlur: (value: any) => void,
  value?: ?any,
  mapCenter: Array<number>,
  mapDialog?: ?React.Element<any>,
};

type State = {
    showMap: ?boolean,
    mapCoordinates?: ?Array<any>,
    zoom: number,
    bounds?: ?any,
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

export default class D2Polygon extends React.Component<Props, State> {
    static defaultProps = {
        mapCenter: [51.505, -0.09],
    }

    constructor(props: Props) {
        super(props);

        this.state = {
            showMap: false,
            zoom: 13,
        };
    }

    onFeatureGroupReady = (reactFGref: any, featureCollection: ?FeatureCollection) => {
        if (featureCollection) {
            const leafletGeoJSON = new L.GeoJSON(featureCollection);
            if (reactFGref) {
                const leafletFG = reactFGref.leafletElement;
                leafletFG.clearLayers();

                leafletGeoJSON.eachLayer((layer) => {
                    leafletFG.addLayer(layer);
                });
                const { map } = reactFGref.contextValue;
                const coordinates = featureCollection.features[0].geometry.coordinates[0];
                const bounds = coordinates.map(c => ([c[1], c[0]]));
                map.fitBounds(bounds);
            }
        } else if (reactFGref) {
            const leafletFG = reactFGref.leafletElement;
            leafletFG.clearLayers();
        }
    };

    getCenter = (featureCollection: ?FeatureCollection) => {
        if (!featureCollection) {
            return this.props.mapCenter;
        }
        const coordinates = featureCollection.features[0].geometry.coordinates[0];
        const { lat, lng } = L.latLngBounds(coordinates.map(c => ([c[0], c[1]]))).getCenter();
        return [lng, lat];
    }

    getFeatureCollection = (coordinates: any) => (Array.isArray(coordinates) ? coordsToFeatureCollection(coordinates) : null)


    closeMap = () => {
        this.setState({ showMap: false });
    }

    openMap = () => {
        this.setState({ showMap: true, mapCoordinates: this.props.value });
    }

    onMapPolygonCreated = (e: any) => {
        const coordinates = e.layer.toGeoJSON().geometry.coordinates;
        this.setState({ mapCoordinates: coordinates, zoom: e.target.getZoom() });
    };

    onMapPolygonEdited = (e: any) => {
        const coordinates = e.layers.getLayers()[0].toGeoJSON().geometry.coordinates;
        this.setState({ mapCoordinates: coordinates, zoom: e.target.getZoom() });
    };
    onMapPolygonDelete = () => {
        this.setState({ mapCoordinates: null });
    };

    onSetPolygon = () => {
        this.props.onBlur(this.state.mapCoordinates);
        this.closeMap();
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

    renderMap = () => {
        const { zoom } = this.state;
        const featureCollection = this.getFeatureCollection(this.state.mapCoordinates);
        const hasPosition = !!featureCollection;
        const center = this.getCenter(featureCollection);
        return (
            <div className={defaultClasses.mapContainer}>
                <Map zoom={zoom} center={center} className={defaultClasses.map} key="map">
                    <WrappedLeafletSearch position="topleft" inputPlaceholder="Search" closeResultsOnClick />
                    <TileLayer
                        url="https://{s}.tile.osm.org/{z}/{x}/{y}.png"
                        attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
                    />
                    <FeatureGroup ref={(reactFGref) => { this.onFeatureGroupReady(reactFGref, featureCollection); }}>
                        <EditControl
                            position="topright"
                            onEdited={this.onMapPolygonEdited}
                            onCreated={this.onMapPolygonCreated}
                            onDeleted={this.onMapPolygonDelete}
                            draw={{
                                rectangle: false,
                                polyline: false,
                                circle: false,
                                marker: false,
                                circlemarker: false,
                            }}
                            edit={{
                                remove: false,
                            }}
                        />
                        <DeleteControl onClick={this.onMapPolygonDelete} disabled={!hasPosition} />
                    </FeatureGroup>
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
                <Button kind="primary" onClick={this.onSetPolygon}>
                    {i18n.t('Set area')}
                </Button>
            </div>
        </div>
    );

    render() {
        const hasValue = !!this.props.value;
        return (
            <div className={defaultClasses.container}>
                <div className={defaultClasses.statusContainer}>
                    <MapIcon className={defaultClasses.mapIcon} onClick={this.openMap} />
                    <div className={defaultClasses.statusText}>
                        {hasValue ? 'Polygon captured' : 'No polygon captured'}
                    </div>
                    { hasValue && <CheckIcon className={defaultClasses.checkIcon} color="primary" /> }
                </div>
                {this.renderMapDialog()}
            </div>
        );
    }
}
