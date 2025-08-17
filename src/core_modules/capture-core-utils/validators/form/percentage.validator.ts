/**
 *
 * @export
 * @param {string} value
 * @returns {boolean}
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const isValidPercentage = (value: string, _internalComponentError?: {error?: string, errorCode?: string}) =>
    /^(100|\d\d|\d)([,.]0*)?( *)?%?$/.test(value);
