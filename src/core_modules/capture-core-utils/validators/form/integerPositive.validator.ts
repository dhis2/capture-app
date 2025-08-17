/**
 *
 * @export
 * @param {string} value
 * @returns {boolean}
 */
export const isValidPositiveInteger = (value: string) => {
    if (isNaN(value as any)) {
        return false;
    }

    const number = Number(value);
    return Number.isSafeInteger(number) && number > 0;
};
