// @flow

type Location = {
    longitude: number,
    latitude: number,
};

/**
 *
 * @export
 * @param { latitude: number, longitude: number } value
 * @returns
 */
const isValidCoordinate = (value: Location) => {
    if (!value) {
        return false;
    }

    const { longitude, latitude } = value;

    const ld = parseInt(longitude, 10);
    const lt = parseInt(latitude, 10);

    return ld >= -180 && ld <= 180 && lt >= -90 && lt <= 90;
};

export default isValidCoordinate;
