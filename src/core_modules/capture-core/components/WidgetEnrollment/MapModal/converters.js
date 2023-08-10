// @flow

export const convertPolygonToServer = (coordinates?: Array<Array<number>> | null): ?Array<[number, number]> => {
    if (!coordinates) {
        return null;
    }
    return Array<[number, number]>(coordinates.map(c => (c ? [c[1], c[0]] : null)));
};

export const convertCoordinatesToServer = (coordinates?: Array<?[number, number]> | null): ?[number, number] => {
    if (!coordinates || !coordinates[0]) {
        return null;
    }

    const lng: number = coordinates[0][1];
    const lat: number = coordinates[0][0];
    return [lng, lat];
};
