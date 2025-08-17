/**
 *
 * @export
 * @param {string} value
 * @returns {boolean}
 */
export const isValidInteger = (value: string) => {
    if (isNaN(value as any)) {
        return false;
    }

    const number = Number(value);
    return Number.isSafeInteger(number);
};
