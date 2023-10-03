// @flow

export const standardGeoJson = (geometry: Array<number> | { longitude: number, latitude: number }) => {
    if (!geometry) {
        return undefined;
    }
    if (Array.isArray(geometry)) {
        return {
            type: 'Polygon',
            coordinates: geometry,
        };
    } else if (geometry.longitude && geometry.latitude) {
        return {
            type: 'Point',
            coordinates: [geometry.longitude, geometry.latitude],
        };
    }
    return undefined;
};
