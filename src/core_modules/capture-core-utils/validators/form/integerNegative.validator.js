// @flow
/**
 *
 * @export
 * @param {string} value
 * @returns
 */
export const isValidNegativeInteger = (value: string) => {
    if (isNaN(value)) {
        return false;
    }

    const number = Number(value);
    return Number.isSafeInteger(number) && number < 0;
};
