// @flow
import moment from '../moment/momentResolver';

export default function isValidDate(value: string) {
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
