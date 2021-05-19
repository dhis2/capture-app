// @flow
/**
 *
 * @export
 * @param {string} value
 * @returns
 */
export const isValidNumber = (value: string) => !!(!isNaN(value) && Number(value) !== Infinity);
