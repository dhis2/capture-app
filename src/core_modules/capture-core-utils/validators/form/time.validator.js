// @flow
import { parseTime } from '../../parsers';

/**
 *
 * @export
 * @param {string} value
 * @returns {boolean}
 */
export function isValidTime(value: string) {
    const momentTime = parseTime(value);
    return momentTime.isValid;
}
