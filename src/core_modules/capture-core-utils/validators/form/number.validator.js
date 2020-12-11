// @flow
/**
 *
 * @export
 * @param {string} value
 * @returns
 */
// eslint-disable-next-line no-restricted-globals
const isNumber = (value: string) => !!(!isNaN(value) && Number(value) !== Infinity);

export default isNumber;
