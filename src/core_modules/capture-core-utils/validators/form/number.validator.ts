/**
 *
 * @export
 * @param {string} value
 * @returns {boolean}
 */
export const isValidNumber = (value: string) => !!(!isNaN(value as any) && Number(value) !== Infinity);
