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

    const ld = parseInt(longitude, 0);
    const lt = parseInt(latitude, 0);

    if (ld < -180 || ld > 180 || lt < -90 || lt > 90) {
        return false;
    }

    return true;
};

export default isValidCoordinate;
