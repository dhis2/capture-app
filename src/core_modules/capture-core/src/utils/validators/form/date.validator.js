// @flow
import parseDate from '../../parsers/date.parser';
/**
 *
 * @export
 * @param {string} value
 * @returns
 */
export default function isValidDate(value: string, format: string) {
    const parseData = parseDate(value, format);
    return parseData.isValid;
}
