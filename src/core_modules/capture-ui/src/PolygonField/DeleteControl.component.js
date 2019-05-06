// @flow
import React from 'react';
import ReactDOM from 'react-dom';
import i18n from '@dhis2/d2-i18n';
import classNames from 'classnames';
import L from 'leaflet';
import { MapControl } from 'react-leaflet';

type Props = {
    position?: any,
    onClick: () => void,
    disabled?: ?boolean,
}

export default class DeleteControl extends MapControl<any, Props> {
    componentWillMount() {
        const deleteControl = L.control({ position: 'topright' });
        const text = i18n.t('Delete polygon');
        const jsx = (
            <div className="leaflet-draw-toolbar leaflet-bar">
                <a
                    className={classNames('leaflet-draw-edit-remove', { 'leaflet-disabled': this.props.disabled })}
                    onClick={this.onClick}
                    title={text}
                    role="button"
                    tabIndex="0"
                >
                    <span />
                </a>
            </div>
        );

        deleteControl.onAdd = (map) => {
            const div = L.DomUtil.create('div', '');
            ReactDOM.render(jsx, div);
            return div;
        };
        this.leafletElement = deleteControl;
    }

    onClick = () => {
        if (!this.props.disabled) {
            this.props.onClick();
        }
    }

    updateLeafletElement(fromProps: Props, toProps: Props): void {
        if (toProps.position !== fromProps.position) {
            this.leafletElement.setPosition(toProps.position);
        }
        if (toProps.disabled !== fromProps.disabled) {
            const buttons = this.leafletElement.getContainer().getElementsByClassName('leaflet-draw-edit-remove');
            if (buttons && buttons.length > 0) {
                buttons[0].className = classNames('leaflet-draw-edit-remove', { 'leaflet-disabled': toProps.disabled });
            }
        }
    }
}
