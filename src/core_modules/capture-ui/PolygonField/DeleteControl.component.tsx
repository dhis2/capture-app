import React, { useEffect, useState, useCallback, type ComponentType } from 'react';
import { createRoot } from 'react-dom/client';
import i18n from '@dhis2/d2-i18n';
import { cx } from '@emotion/css';
import L, { Control } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import { withLeaflet } from 'react-leaflet';
import { isLangRtl } from 'capture-ui';

type Props = {
    onClick: () => void;
    disabled?: boolean | null;
    leaflet: typeof Control;
};

const DeleteControlPlain = ({ onClick, disabled, leaflet }: Props) => {
    const [leafletElement, setLeafletElement] = useState<any>();
    const onHandleClick = useCallback(() => !disabled && onClick(), [disabled, onClick]);

    useEffect(() => {
        const deleteControl = L.control({ position: isLangRtl() ? 'topleft' : 'topright' });
        const text = i18n.t('Delete polygon');
        const jsx = (
            <div className="leaflet-draw-toolbar leaflet-bar">
                {/* eslint-disable-next-line */}
                <a
                    className={cx('leaflet-draw-edit-remove', { 'leaflet-disabled': disabled })}
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
        leafletElement?.addTo(leaflet.map);
    }, [leafletElement, leaflet.map]);

    useEffect(() => () => leafletElement?.remove(), [leafletElement]);

    return null;
};

export const DeleteControl = withLeaflet(DeleteControlPlain) as ComponentType<Omit<Props, 'leaflet'>>;
