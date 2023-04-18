
// @flow
import { dataElementTypes } from '../../../metaData';


export const convertToClientCoordinates = (coordinates: any[], type: $Values<typeof dataElementTypes>) => {
    switch (type) {
    case dataElementTypes.COORDINATE:
        return [coordinates[1], coordinates[0]];
    case dataElementTypes.POLYGON:
        return coordinates[0].map(coord => [coord[1], coord[0]]);
    default:
        return coordinates;
    }
};
