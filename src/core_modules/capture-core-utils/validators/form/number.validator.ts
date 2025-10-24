/**
 *
 * @export
 * @param {string} value
 * @returns {boolean}
 */
export const isValidNumber = (
    value: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _internalComponentError?: {error?: string, errorCode?: string},
) => !!(!isNaN(value as any) && Number(value) !== Infinity);
