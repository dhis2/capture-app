// @flow
/**
 *
 * @export
 * @param {string} value
 * @returns
 */
export const isValidPercentage = (value: string) =>
    /^(100|\d\d|\d)([,.]0*)?( *)?%?$/.test(value);
