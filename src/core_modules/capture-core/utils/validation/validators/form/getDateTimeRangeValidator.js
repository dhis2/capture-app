// @flow
import { Temporal } from '@js-temporal/polyfill';
import { convertStringToTemporal } from 'capture-core/utils/converters/date';
import { isValidDateTime } from './dateTimeValidator';

function isValidDateTimeWithEmptyCheck(value: ?Object) {
    return value && isValidDateTime(value);
}
const convertDateTimeToTemporal = (value: Object) => {
    const { date, time } = value;

    const dateInTemporal = convertStringToTemporal(date);

    if (!dateInTemporal) {
        return null;
    }
    const { year, month, day } = dateInTemporal;

    let hour;
    let minutes;
    if (/[:.]/.test(time)) {
        [hour, minutes] = time.split(/[:.]/).map(Number);
    } else if (time.length === 3) {
        hour = Number(time.substring(0, 1));
        minutes = Number(time.substring(2, 3));
    } else {
        hour = Number(time.substring(0, 2));
        minutes = Number(time.substring(3, 4));
    }

    return new Temporal.PlainDateTime(year, month, day, hour, minutes);
};

export const getDateTimeRangeValidator = (invalidDateTimeMessage: string) =>
    (value: { from?: ?Object, to?: ?Object }) => {
        const errorResult = [];
        if (!isValidDateTimeWithEmptyCheck(value.from)) {
            errorResult.push({ from: invalidDateTimeMessage });
        }

        if (!isValidDateTimeWithEmptyCheck(value.to)) {
            errorResult.push({ to: invalidDateTimeMessage });
        }

        if (errorResult.length > 0) {
            return {
                valid: false,
                // $FlowFixMe[exponential-spread] automated comment
                errorMessage: errorResult.reduce((map, error) => ({ ...map, ...error }), {}),
            };
        }

        const fromDateTime = convertDateTimeToTemporal(value.from);
        const toDateTime = convertDateTimeToTemporal(value.to);
        if (!fromDateTime || !toDateTime) {
            return false;
        }
        return Temporal.PlainDateTime.compare(fromDateTime, toDateTime) <= 0;
    };
