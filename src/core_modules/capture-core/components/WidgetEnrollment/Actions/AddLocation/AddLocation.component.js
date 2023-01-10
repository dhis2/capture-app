// @flow
import { IconLocation16, MenuItem } from '@dhis2/ui';
import React, { useState, useMemo } from 'react';
import i18n from '@dhis2/d2-i18n';
import { dataElementTypes } from '../../../../metaData';
import { MapCoordinatesModal } from '../../../../components/MapCoordinates';
import { useProgramFromIndexedDB } from '../../../../utils/cachedDataHooks/useProgramFromIndexedDB';
import type { Props } from './addLocation.types';

const DEFAULT_CENTER = [51.505, -0.09];
export const AddLocation = ({ enrollment, onUpdate }: Props) => {
    const [isOpen, setOpen] = useState(false);
    const { program, isLoading, isError } = useProgramFromIndexedDB(enrollment.program);
    const geometryType = useMemo(() => {
        if (!program) { return undefined; }
        return program.featureType === 'POINT' ? dataElementTypes.COORDINATE : dataElementTypes.POLYGON;
    }, [program]);

    if (isLoading || isError) {
        return null;
    }
    if (enrollment.geometry || !program?.featureType) {
        return null;
    }
    const getServerFeatureType = () => {
        switch (geometryType) {
        case dataElementTypes.COORDINATE:
            return 'Point';
        case dataElementTypes.POLYGON:
            return 'Polygon';
        default:
            return '';
        }
    };
    const getLabel = () => {
        switch (geometryType) {
        case dataElementTypes.COORDINATE:
            return i18n.t('Add coordinates');
        default:
            return i18n.t('Add area');
        }
    };

    return (<>
        <MenuItem
            dense
            dataTest="widget-enrollment-actions-add-location"
            icon={<IconLocation16 />}
            label={getLabel()}
            onClick={() => { setOpen(true); }}
        />
        <MapCoordinatesModal
            center={DEFAULT_CENTER}
            isOpen={isOpen}
            type={geometryType}
            setOpen={setOpen}
            onSetCoordinates={(coord) => {
                onUpdate({ ...enrollment, geometry: { type: getServerFeatureType(), coordinates: coord } });
            }}
        />
    </>);
};
