// @flow
import i18n from '@dhis2/d2-i18n';
import { dataElementTypes } from '../../../metaData';
import { useProgram } from './useProgram';

export const useGeometry = (enrollment: { program: string }) => {
    const {
        program: { featureType },
    } = useProgram(enrollment.program);

    if (featureType === 'POINT') {
        return {
            geometryType: 'Point',
            dataElementType: dataElementTypes.COORDINATE,
        };
    }

    return {
        geometryType: 'Polygon',
        dataElementType: dataElementTypes.POLYGON,
    };
};

export const useGeometryLabel = (enrollment: { program: string, geometry: { type: string } }) => {
    const {
        program: { featureType },
        error,
    } = useProgram(enrollment.program);

    if (error || !featureType || !['POINT', 'POLYGON'].includes(featureType) || enrollment.geometry?.type) {
        return undefined;
    }

    if (featureType === 'POINT') {
        return i18n.t('Add coordinates');
    }

    return i18n.t('Add area');
};
