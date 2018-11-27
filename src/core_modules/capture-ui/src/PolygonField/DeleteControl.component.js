import React from 'react';
import ReactDOM from 'react-dom';
import L from 'leaflet';
import { MapControl } from 'react-leaflet';

export default class CenterControl extends MapControl {  // note we're extending MapControl from react-leaflet, not Component from react
    componentWillMount() {
        const centerControl = L.control({ position: 'topright' });  // see http://leafletjs.com/reference.html#control-positions for other positions
        const jsx = (
            // PUT YOUR JSX FOR THE COMPONENT HERE:
            <div onClick={this.props.onClick}>
              Delete
            </div>
        );

        centerControl.onAdd = function (map) {
            const div = L.DomUtil.create('div', '');
            ReactDOM.render(jsx, div);
            return div;
        };

        this.leafletElement = centerControl;
    }
}
