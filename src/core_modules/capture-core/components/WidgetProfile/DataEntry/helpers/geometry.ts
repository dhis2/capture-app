import { dataElementTypes } from '../../../../metaData';

export const GEOMETRY = {
    POINT: 'Point',
    POLYGON: 'Polygon',
};

export const getFeatureType = (featureType: string) => {
    switch (featureType) {
    case 'POINT':
        return GEOMETRY.POINT;
    case 'POLYGON':
        return GEOMETRY.POLYGON;
    default:
        return null;
    }
};

export const getDataElement = (featureType: string) => {
    switch (featureType) {
    case 'POINT':
        return dataElementTypes.COORDINATE;
    case 'POLYGON':
        return dataElementTypes.POLYGON;
    default:
        return null;
    }
};

export const getLabel = (featureType: string): string | null => {
    switch (featureType) {
    case 'POINT':
        return 'Coordinate';
    case 'POLYGON':
        return 'Area';
    default:
        return null;
    }
};
