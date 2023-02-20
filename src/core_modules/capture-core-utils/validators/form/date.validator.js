// @flow
import { parseDate } from '../../parsers';
/**
 *
 * @export
 * @param {string} value
 * @returns {boolean}
 */
export function isValidDate(value: ?string, format: string) {
    if (!value) {
        return false;
    }
    const parseData = parseDate(value, format);
    return parseData.isValid;
}
