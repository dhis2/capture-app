// @flow
/**
 *
 * @export
 * @param {string} value
 * @returns
 */
const isNumber = (value: string) => !!(!isNaN(value) && Number(value) !== Infinity);

export default isNumber;
