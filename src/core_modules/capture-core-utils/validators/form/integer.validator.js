// @flow
/**
 *
 * @export
 * @param {string} value
 * @returns
 */
export const isValidInteger = (value: string) => {
    if (isNaN(value)) {
        return false;
    }

    const number = Number(value);
    return Number.isSafeInteger(number);
};
