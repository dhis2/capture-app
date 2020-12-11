// @flow

type Location = {
  longitude: number,
  latitude: number,
};

function isNumValid(num) {
  if (typeof num === 'number') {
    return true;
  }
  if (typeof num === 'string') {
    return num.match(/[^0-9.,-]+/) === null;
  }

  return false;
}

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
  if (!isNumValid(latitude) || !isNumValid(longitude)) {
    return false;
  }

  const ld = parseInt(longitude, 10);
  const lt = parseInt(latitude, 10);

  return ld >= -180 && ld <= 180 && lt >= -90 && lt <= 90;
};

export default isValidCoordinate;
