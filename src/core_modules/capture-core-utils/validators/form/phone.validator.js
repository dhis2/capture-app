// @flow

/**
 *
 * @export
 * @param {string} value
 * @returns
 */
export const isValidPhoneNumber = (value: string) => /^[^a-zA-Z]+$/.test(value);
