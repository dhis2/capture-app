// @flow
import { dataElementTypes } from '../../../metaData';

export const convertToServerCoordinates = (
    coordinates?: Array<[number, number]> | null,
    type: string,
): ?[number, number] | ?Array<[number, number]> | ?[number, number] => {
    if (!coordinates) {
        return null;
    }
    switch (type) {
    case dataElementTypes.COORDINATE: {
        const lng: number = coordinates[0][1];
        const lat: number = coordinates[0][0];
        return [lng, lat];
    }
    case dataElementTypes.POLYGON:
        return Array<[number, number]>(coordinates.map(c => [c[1], c[0]]));
    default:
        return coordinates;
    }
};
