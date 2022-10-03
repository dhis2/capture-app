// @flow

/**
 *
 * @export
 * @param {string} value
 * @returns {boolean}
 */
export const isValidPhoneNumber = (value: string) => /^[^a-zA-Z]+$/.test(value);
