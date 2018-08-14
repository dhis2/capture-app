// @flow
import parseDate from '../../parsers/date.parser';
/**
 *
 * @export
 * @param {string} value
 * @param {boolean} [isEmptyValid=false] by default empty is not a valid date. In your form you should precheck this and not call isValidDate if empty.
 * @returns
 */
export default function isValidDate(value: string, isEmptyValid: boolean = false) {
    if (!value) {
        return isEmptyValid;
    }

    const parseData = parseDate(value);
    return parseData.isValid;
}
