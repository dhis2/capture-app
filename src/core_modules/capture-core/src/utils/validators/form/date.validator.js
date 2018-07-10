// @flow
import moment from '../../moment/momentResolver';

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

    const dateString = value;

    const momentDate = moment(dateString, 'L', true);
    const isValid = momentDate.isValid();
    if (!isValid) {
        return isValid;
    }

    if (!momentDate.isAfter(999, 'year')) {
        return false;
    }

    return true;
}
