type Location = {
    longitude: number;
    latitude: number;
};

function isNumValid(num: number | string | undefined): boolean {
    if (typeof num === 'number') {
        return true;
    } else if (typeof num === 'string') {
        return num.match(/[^0-9.,-]+/) === null;
    }

    return false;
}

export const isValidCoordinate = (value: Location | null | undefined): boolean => {
    if (!value) {
        return false;
    }

    const { longitude, latitude } = value;
    if (!isNumValid(latitude) || !isNumValid(longitude)) {
        return false;
    }

    const ld = parseInt(longitude.toString(), 10);
    const lt = parseInt(latitude.toString(), 10);

    return ld >= -180 && ld <= 180 && lt >= -90 && lt <= 90;
};
