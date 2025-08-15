import { capitalizeFirstLetter } from '../../../../../capture-core-utils/string';
import { FEATURETYPE } from '../../../../constants';

const standardGeoJson = (geometry: Array<number> | { longitude: number; latitude: number }) => {
    if (Array.isArray(geometry)) {
        return geometry;
    } else if (geometry.longitude && geometry.latitude) {
        return [geometry.longitude, geometry.latitude];
    }
    return undefined;
};

export const geometryType = (formValuesKey: any) =>
    Object.values(FEATURETYPE).find(geometryKey => geometryKey === formValuesKey);

export const getPossibleTetFeatureTypeKey = (serverValues: Record<string, any> = {}) =>
    Object.keys(serverValues).find(key => key.startsWith('FEATURETYPE_'));

export const buildGeometryProp = (key: string, serverValues: Record<string, any>) => {
    if (!serverValues[key]) {
        return undefined;
    }
    const type = capitalizeFirstLetter(key.replace('FEATURETYPE_', '').toLocaleLowerCase());
    const coordinates = standardGeoJson(serverValues[key]);
    return {
        type,
        coordinates,
    };
};
