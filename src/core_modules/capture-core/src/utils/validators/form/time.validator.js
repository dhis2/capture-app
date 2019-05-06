// @flow

/**
 *
 * @export
 * @param {string} value
 * @returns
 */
const isValidTime = (value: string) => /^(([0-1]*[0-9])|(2[0-3]))([:.])*([0-5][0-9])$/.test(value);

export default isValidTime;
