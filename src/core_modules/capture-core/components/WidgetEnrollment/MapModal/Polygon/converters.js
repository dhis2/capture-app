// @flow

export const convertPolygonToServer = (coordinates?: Array<Array<number>> | null): ?Array<[number, number]> => {
    if (!coordinates) {
        return null;
    }
    return Array<[number, number]>(coordinates.map(c => (c ? [c[1], c[0]] : null)));
};
