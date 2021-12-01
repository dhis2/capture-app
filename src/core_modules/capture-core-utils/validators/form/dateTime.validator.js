// @flow
import { isValidTime } from './time.validator';
import { isValidDate } from './date.validator';

type DateTimeValue = {
    date?: ?string,
    time?: ?string,
};

export function isValidDateTime(value: DateTimeValue, dateFormat: string) {
    if (!value) return false;
    const date = value.date;
    const time = value.time;

    if (!date || !time) {
        return false;
    }

    return (isValidDate(date, dateFormat) && isValidTime(time));
}
