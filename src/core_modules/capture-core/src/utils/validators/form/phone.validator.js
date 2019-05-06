// @flow

/**
 *
 * @export
 * @param {string} value
 * @returns
 */
const isValidPhoneNumber = (value: string) => /^[^a-zA-Z]+$/.test(value);

export default isValidPhoneNumber;
