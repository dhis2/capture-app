import { dataElementTypes } from '../../../../metaData';
import type { GeometryValues } from '../types/dataEntry.types';

export const GEOMETRY: { POINT: GeometryValues, POLYGON: GeometryValues } = {
    POINT: {
        FEATURETYPE: 'FEATURETYPE_POINT',
        DATAELEMENTTYPE: dataElementTypes.COORDINATE,
        LABEL: 'Coordinate',
    },
    POLYGON: {
        FEATURETYPE: 'FEATURETYPE_POLYGON',
        DATAELEMENTTYPE: dataElementTypes.POLYGON,
        LABEL: 'Area',
    },
};

export const getFeatureType = (type: string): string => GEOMETRY[type]?.FEATURETYPE ?? type;
export const getDataElement = (type: string): string => GEOMETRY[type]?.DATAELEMENTTYPE ?? type;
export const getLabel = (type: string): string => GEOMETRY[type]?.LABEL ?? type;
