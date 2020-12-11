// @flow
import { isValidDateTime } from './dateTimeValidator';
import { parseDate } from '../../converters/date';

function isValidDateTimeWithEmptyCheck(value: ?Object) {
    return value && isValidDateTime(value);
}
const convertDateTimeToMoment = (value: Object) => {
    const {date} = value;
    const {time} = value;
    let hour;
    let minutes;
    if (/[:.]/.test(time)) {
        [hour, minutes] = time.split(/[:.]/);
    } else if (time.length === 3) {
        hour = time.substring(0, 1);
        minutes = time.substring(2, 3);
    } else {
        hour = time.substring(0, 2);
        minutes = time.substring(3, 4);
    }
    const momentDateTime = parseDate(date).momentDate;
    // $FlowFixMe[incompatible-use] automated comment
    momentDateTime.hour(hour);
    // $FlowFixMe[incompatible-use] automated comment
    momentDateTime.minute(minutes);
    return momentDateTime;
};

export const getDateTimeRangeValidator = (invalidDateTimeMessage: string) =>
    (value: { from?: ?Object, to?: ?Object}) => {
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

        const fromDateTime = convertDateTimeToMoment(value.from);
        const toDateTime = convertDateTimeToMoment(value.to);
        // $FlowFixMe[invalid-compare] automated comment
        return fromDateTime <= toDateTime;
    };
