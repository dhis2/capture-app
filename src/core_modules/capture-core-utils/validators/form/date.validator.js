// @flow
import { parseDate } from '../../parsers';
/**
 *
 * @export
 * @param {string} value
 * @param {string} format
 * @returns {boolean}
 */
export function isValidDate(value: string, format: string) {
    const parseData = parseDate(value, format);
    return parseData.isValid;
}
