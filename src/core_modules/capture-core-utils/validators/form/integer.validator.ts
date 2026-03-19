/**
 *
 * @export
 * @param {string} value
 * @returns {boolean}
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const isValidInteger = (value: string, _internalComponentError?: {error?: string, errorCode?: string}) => {
    if (isNaN(value as any)) {
        return false;
    }

    const number = Number(value);
    return Number.isSafeInteger(number);
};
