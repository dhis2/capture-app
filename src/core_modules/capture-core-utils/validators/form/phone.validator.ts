/**
 *
 * @export
 * @param {string} value
 * @returns {boolean}
 */
export const isValidPhoneNumber = (
    value: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _internalComponentError?: {error?: string, errorCode?: string},
) => /^[^a-zA-Z]+$/.test(value);
