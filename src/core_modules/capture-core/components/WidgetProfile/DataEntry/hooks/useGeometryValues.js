// @flow
import { useState, useEffect } from 'react';
import { convertClientToForm, convertServerToClient } from '../../../../converters';
import type { Geometry } from '../helpers/types';
import { GEOMETRY, getFeatureType, getDataElement } from '../helpers';

export const useGeometryValues = ({ featureType, geometry }: { featureType: string, geometry: ?Geometry }) => {
    const [formGeometryValues, setFormValues] = useState<any>({});
    const [clientGeometryValues, setClientValues] = useState<any>({});

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
