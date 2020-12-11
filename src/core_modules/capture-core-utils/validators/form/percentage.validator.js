// @flow
/**
 *
 * @export
 * @param {string} value
 * @returns
 */
const isValidPercentage = (value: string) => {
  const replacedValue = value.replace('%', '');
  // eslint-disable-next-line no-restricted-globals
  return !!(!isNaN(replacedValue) && Number(replacedValue) !== Infinity);
};

export default isValidPercentage;
