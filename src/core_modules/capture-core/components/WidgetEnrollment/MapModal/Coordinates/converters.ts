export const convertCoordinatesToServer = (
    coordinates?: Array<[number, number] | null> | null,
): [number, number] | null => {
    if (!coordinates || !coordinates[0]) {
        return null;
    }

    const lng: number = coordinates[0][1];
    const lat: number = coordinates[0][0];
    return [lng, lat];
};
