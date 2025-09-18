/**
 *
 * @export
 * @param {string} value
 * @returns {boolean}
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const isValidNumber = (
    value: string,
) => !!(!isNaN(value as any) && Number(value) !== Infinity);
