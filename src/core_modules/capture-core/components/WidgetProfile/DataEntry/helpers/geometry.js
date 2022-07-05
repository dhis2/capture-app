// @flow
import { dataElementTypes } from '../../../../metaData';

export const GEOMETRY = {
    POINT: 'POINT',
    POLYGON: 'POLYGON',
};

export const FEATURETYPE = {
    POINT: 'FEATURETYPE_POINT',
    POLYGON: 'FEATURETYPE_POLYGON',
};

const DATAELEMENTTYPE = {
    POINT: dataElementTypes.COORDINATE,
    POLYGON: dataElementTypes.POLYGON,
};

const LABELS = {
    POINT: 'Coordinate',
    POLYGON: 'Area',
};

export const getFeatureType = (type: string) => FEATURETYPE[type] || type;
export const getDataElement = (type: string) => DATAELEMENTTYPE[type] || type;
export const getLabel = (type: string) => LABELS[type] || type;
