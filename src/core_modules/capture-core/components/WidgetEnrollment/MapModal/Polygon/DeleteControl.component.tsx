import React, { useEffect, useState, useCallback, type ComponentType } from 'react';
import { createRoot } from 'react-dom/client';
import i18n from '@dhis2/d2-i18n';
import classNames from 'classnames';
import L from 'leaflet';
import { withLeaflet } from 'react-leaflet';

type Props = {
    onClick: () => void;
    disabled?: boolean | null;
    leaflet: any;
};

const DeleteControlPlain = ({ onClick, disabled, leaflet }: Props) => {
    const [leafletElement, setLeafletElement] = useState<any>();
    const onHandleClick = useCallback(() => !disabled && onClick(), [disabled, onClick]);

    useEffect(() => {
        const deleteControl = L.control({ position: 'topright' });
        const text = i18n.t('Delete polygon');
        const jsx = (
            <div className="leaflet-draw-toolbar leaflet-bar">
                {/* eslint-disable-next-line */}
                <a
                    className={classNames('leaflet-draw-edit-remove', { 'leaflet-disabled': disabled })}
                    onClick={onHandleClick}
                    title={text}
                    role="button"
                    tabIndex={0}
                />
            </div>
        );

        deleteControl.onAdd = () => {
            const div = L.DomUtil.create('div', '');
            const root = createRoot(div);
            root.render(jsx);
            return div;
        };
        setLeafletElement(deleteControl);
    }, [onHandleClick, disabled]);

    useEffect(() => {
        leafletElement && leaflet.map && leafletElement.addTo(leaflet.map);
    }, [leafletElement, leaflet.map]);

    useEffect(() => () => leafletElement && leafletElement.remove(), [leafletElement]);

    return null;
};

export const DeleteControl = withLeaflet(DeleteControlPlain) as ComponentType<Omit<Props, 'leaflet'>>;
