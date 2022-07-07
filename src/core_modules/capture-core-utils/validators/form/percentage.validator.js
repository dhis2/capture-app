// @flow
/**
 *
 * @export
 * @param {string} value
 * @returns
 */
const isValidPercentage = (value: string) =>
    /^(100|\d\d|\d)([,.]0*)?( *)?%?$/.test(value);

export default isValidPercentage;
