// @flow
import parseDate from '../../parsers/date.parser';
/**
 *
 * @export
 * @param {string} value
 * @returns
 */
export default function isValidDate(value: string) {
    const parseData = parseDate(value);
    return parseData.isValid;
}
