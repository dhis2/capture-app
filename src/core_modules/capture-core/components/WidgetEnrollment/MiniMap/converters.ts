import { dataElementTypes } from '../../../metaData';

export const convertToClientCoordinates = (
    coordinates: any[],
    type: typeof dataElementTypes.COORDINATE | typeof dataElementTypes.POLYGON,
) => {
    if (type === dataElementTypes.COORDINATE) {
        return [coordinates[1], coordinates[0]];
    }

    return coordinates[0].map(coord => [coord[1], coord[0]]);
};
