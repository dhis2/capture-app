// @flow
import { useState, useEffect } from 'react';
import { dataElementTypes } from '../../../../metaData';
import { convertClientToForm, convertServerToClient } from '../../../../converters';
import type { Geometry } from '../helpers/types';

export const useGeometryValues = ({ featureType, geometry }: { featureType: string, geometry: ?Geometry }) => {
    const [formGeometryValues, setFormValues] = useState<any>({});
    const [clientGeometryValues, setClientValues] = useState<any>({});

    useEffect(() => {
        if (geometry && ['POLYGON', 'POINT'].includes(featureType)) {
            const dataElementType =
                featureType === dataElementTypes.POLYGON ? dataElementTypes.POLYGON : dataElementTypes.COORDINATE;
            const clientValue = convertServerToClient(geometry.coordinates, dataElementType);
            const formValue = convertClientToForm(clientValue, dataElementType);

            setFormValues({ [`FEATURETYPE_${featureType}`]: formValue });
            setClientValues({ [`FEATURETYPE_${featureType}`]: clientValue });
        }
    }, [geometry, featureType]);

    return { formGeometryValues, clientGeometryValues };
};
