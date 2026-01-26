import * as React from 'react';
import i18n from '@dhis2/d2-i18n';
import { isLangRtl } from 'capture-core/utils/rtl';
import { IconCheckmark16, IconLocation16, colors, Button, ModalContent, ModalActions } from '@dhis2/ui';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import { Map, TileLayer, FeatureGroup, ZoomControl, withLeaflet } from 'react-leaflet';
import { ReactLeafletSearch } from 'react-leaflet-search-unpolyfilled';
import { EditControl } from 'react-leaflet-draw';
import defaultClasses from './polygonField.module.css';
import './styles.css';
import { DeleteControl } from './DeleteControl.component';

const WrappedLeafletSearch = withLeaflet(ReactLeafletSearch);

type Props = {
  onBlur: (value: any) => void;
  onOpenMap: (hasValue: boolean) => void;
  value?: any | null | undefined;
  center?: Array<number> | null | undefined;
  mapDialog?: any;
};

type State = {
    showMap: boolean | null | undefined;
    mapCoordinates?: Array<any> | null | undefined;
    zoom: number;
    bounds?: any | null | undefined;
}

type Feature = {
    type: string;
    properties: any;
    geometry: {
        type: string;
        coordinates: Array<Array<Array<number>>>;
    };
}

type FeatureCollection = {
    type: string;
    features: Array<Feature>;
};

function coordsToFeatureCollection(coordinates: any): FeatureCollection | null | undefined {
    if (!coordinates) {
        return null;
    }

    const list = coordinates[0].map((c: any) => [...c, 0]);
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

export class PolygonField extends React.Component<Props, State> {
    mapInstance: any | null | undefined;
    constructor(props: Props) {
        super(props);

        this.state = {
            showMap: false,
            zoom: 13,
        };
    }

    componentDidUpdate() {
        if (this.mapInstance && this.state.showMap) {
            this.mapInstance.leafletElement.invalidateSize();
        }
    }

    onFeatureGroupReady = (reactFGref: any, featureCollection: FeatureCollection | null | undefined) => {
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

    getFeatureCollection = (coordinates: any) => (Array.isArray(coordinates) ? coordsToFeatureCollection(coordinates) : null)

    getCenter = (featureCollection: FeatureCollection | null | undefined) => {
        if (!featureCollection) {
            return this.props.center;
        }
        const coordinates = featureCollection.features[0].geometry.coordinates[0];
        const { lat, lng } = L.latLngBounds(coordinates.map(c => ([c[0], c[1]]))).getCenter();
        return [lng, lat];
    }

    setMapInstance = (mapInstance: any) => {
        this.mapInstance = mapInstance;
    }

    openMap = () => {
        this.props.onOpenMap(Boolean(this.props.value));
        this.setState({ showMap: true, mapCoordinates: this.props.value });
    }

    closeMap = () => {
        this.setState({ showMap: false });
    }

    renderMapDialog = () => {
        const clonedDialog = React.cloneElement(

            this.props.mapDialog,
            { hide: !this.state.showMap, onClose: this.closeMap },

            [...React.Children.toArray(this.props.mapDialog?.props?.children || []), (
                <>
                    <ModalContent className={defaultClasses.dialogContent} key="dialogContent">
                        {this.renderMap()}
                    </ModalContent>
                    {this.renderDialogActions()}
                </>
            )],
        );
        return clonedDialog;
    }

    renderMap = () => {
        const { zoom } = this.state;
        const featureCollection = this.getFeatureCollection(this.state.mapCoordinates);
        const hasPosition = !!featureCollection;
        const center = this.getCenter(featureCollection);
        const rtl = isLangRtl();
        const buttonPosition = rtl ? 'topright' : 'topleft';
        return (
            <div className={defaultClasses.mapContainer}>
                <Map
                    zoom={zoom}
                    center={center}
                    className={defaultClasses.map}
                    key="map"
                    zoomControl={false}
                    ref={(mapInstance) => { this.setMapInstance(mapInstance); }}
                >
                    <ZoomControl position={buttonPosition} />
                    <WrappedLeafletSearch position={buttonPosition} inputPlaceholder="Search" closeResultsOnClick />
                    <TileLayer
                        url="https://{s}.tile.osm.org/{z}/{x}/{y}.png"
                        attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
                    />
                    <FeatureGroup ref={(reactFGref) => { this.onFeatureGroupReady(reactFGref, featureCollection); }}>
                        <EditControl
                            position={rtl ? 'topleft' : 'topright'}
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
        <ModalActions>
            <Button secondary onClick={this.closeMap}>
                {i18n.t('Cancel') as React.ReactNode}
            </Button>
            <Button primary onClick={this.onSetPolygon}>
                {i18n.t('Set area') as React.ReactNode}
            </Button>
        </ModalActions>
    );

    render() {
        const hasValue = !!this.props.value;
        return (
            <div className={defaultClasses.container}>
                <div className={defaultClasses.statusContainer}>
                    { hasValue && (
                        <>
                            <span className={defaultClasses.checkIcon}>
                                <IconCheckmark16 color={colors.blue600} />
                            </span>
                            <div className={defaultClasses.statusText}>
                                {i18n.t('Area on map saved') as React.ReactNode}
                            </div>
                        </>
                    )
                    }
                    <Button
                        onClick={this.openMap}
                        icon={<IconLocation16 />}
                        small
                    >
                        {hasValue ? 'Edit area on map' : 'Choose area on map'}
                    </Button>

                </div>
                {this.renderMapDialog()}
            </div>
        );
    }
}
