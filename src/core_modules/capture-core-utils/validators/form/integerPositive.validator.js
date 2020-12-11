// @flow
/**
 *
 * @export
 * @param {string} value
 * @returns
 */
const isValidPositiveInteger = (value: string) => {
  // eslint-disable-next-line no-restricted-globals
  if (isNaN(value)) {
    return false;
  }

  const number = Number(value);
  return Number.isSafeInteger(number) && number > 0;
};

export default isValidPositiveInteger;
