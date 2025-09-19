/**
 *
 * @export
 * @param {string} value
 * @returns {boolean}
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const isValidPhoneNumber = (value: string, _internalComponentError?: {error?: string, errorCode?: string}) => /^[^a-zA-Z]+$/.test(value);
