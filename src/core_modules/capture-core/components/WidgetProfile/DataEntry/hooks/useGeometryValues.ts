import { useState, useEffect } from 'react';
import { convertClientToForm, convertServerToClient } from '../../../../converters';
import { GEOMETRY, getFeatureType, getDataElement } from '../helpers';
import type { UseGeometryValuesParams } from './hooks.types';

export const useGeometryValues = ({ featureType, geometry }: UseGeometryValuesParams) => {
    const [formGeometryValues, setFormValues] = useState<Record<string, any>>({});
    const [clientGeometryValues, setClientValues] = useState<Record<string, any>>({});

    useEffect(() => {
        if (geometry && Object.keys(GEOMETRY).includes(featureType)) {
            const dataElementType = getDataElement(featureType);
            const clientValue = convertServerToClient(geometry.coordinates, dataElementType);
            const formValue = convertClientToForm(clientValue, dataElementType);
            const convertedFeatureType = getFeatureType(featureType);

            setFormValues({ [convertedFeatureType]: formValue });
            setClientValues({ [convertedFeatureType]: clientValue });
        }
    }, [geometry, featureType]);

    return { formGeometryValues, clientGeometryValues };
};
