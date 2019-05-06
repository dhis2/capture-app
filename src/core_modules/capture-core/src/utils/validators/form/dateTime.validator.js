// @flow
import isValidDate from './date.validator';
import isValidTime from './time.validator';

type DateTimeValue = {
    date?: ?string,
    time?: ?string,
};

export default function isValidDateTime(value: DateTimeValue) {
    if (!value) return false;
    const date = value.date;
    const time = value.time;

    if (!date || !time) {
        return false;
    }

    return (isValidDate(date) && isValidTime(time));
}
