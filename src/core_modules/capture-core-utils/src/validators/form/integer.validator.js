// @flow
/**
 *
 * @export
 * @param {string} value
 * @returns
 */
const isValidInteger = (value: string) => {
    if (isNaN(value)) {
        return false;
    }

    const number = Number(value);
    return Number.isSafeInteger(number);
};

export default isValidInteger;
