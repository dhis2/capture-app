// @flow
import { dataElementTypes } from '../../../../metaData';

type GeometryValues = { FEATURETYPE: string, DATAELEMENTTYPE: string, LABEL: string };

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
