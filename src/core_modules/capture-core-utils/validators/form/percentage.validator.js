// @flow
/**
 *
 * @export
 * @param {string} value
 * @returns
 */
const isValidPercentage = (value: string) => {
  const replacedValue = value.replace('%', '');
  return !!(!isNaN(replacedValue) && Number(replacedValue) !== Infinity);
};

export default isValidPercentage;
