/**
 *
 * @export
 * @param {string} value
 * @returns {boolean}
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const isValidPhoneNumber = (
    value: string,
) => /^[^a-zA-Z]+$/.test(value);
