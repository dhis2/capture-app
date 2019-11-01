// @flow
/**
 *
 * @export
 * @param {string} value
 * @returns
 */
const isNumber = (value: string) => {
    return !!(!isNaN(value) && Number(value) !== Infinity);
};

export default isNumber;
