export const convertPolygonToServer = (coordinates?: Array<Array<number>> | null): Array<[number, number]> | null => {
    if (!coordinates) {
        return null;
    }
    return coordinates.map(c => ([c[1], c[0]] as [number, number]));
};
