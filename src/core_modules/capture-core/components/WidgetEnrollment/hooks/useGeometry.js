// @flow
import { useMemo } from 'react';
import i18n from '@dhis2/d2-i18n';
import { dataElementTypes } from '../../../metaData';
import { useProgram } from './useProgram';

export const useGeometry = (enrollment: {program: string, geometry: string}) => {
    const { program, error } = useProgram(enrollment.program);
    const dataElementType = useMemo(() => {
        if (!program) {
            return undefined;
        }
        return program.featureType === 'POINT' ? dataElementTypes.COORDINATE : dataElementTypes.POLYGON;
    }, [program]);

    if (error || enrollment.geometry || !program?.featureType || program.featureType === 'NONE') {
        return { geometryType: undefined, label: undefined, dataElementType };
    }

    switch (dataElementType) {
    case dataElementTypes.COORDINATE:
        return { geometryType: 'Point', dataElementType, label: i18n.t('Add coordinates') };
    case dataElementTypes.POLYGON:
        return { geometryType: 'Polygon', dataElementType, label: i18n.t('Add area') };
    default:
        return { geometryType: undefined, dataElementType, label: undefined };
    }
};
