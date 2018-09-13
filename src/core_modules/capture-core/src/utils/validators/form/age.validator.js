// @flow
import parseDate from '../../parsers/date.parser';
/**
 *
 * @export
 * @param {string} value
 * @returns
 */
export default function isValidAge(value: string, isEmptyValid: boolean = false) {
    if (!value) {
        return isEmptyValid;
    }

    const parseData = parseDate(value);
    return parseData.isValid;
}
