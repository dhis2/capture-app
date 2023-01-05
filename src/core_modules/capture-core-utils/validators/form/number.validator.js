// @flow
/**
 *
 * @export
 * @param {string} value
 * @returns {boolean}
 */
export const isValidNumber = (value: string) => !!(!isNaN(value) && Number(value) !== Infinity);
