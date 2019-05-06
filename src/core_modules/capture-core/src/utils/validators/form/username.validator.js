// @flow

/**
 *
 * @export
 * @param {string} value
 * @returns
 */
export default function isValidUsername(value: string) {
    return value.length > 3;
}
