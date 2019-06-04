// @flow
import dateTimeValidator from './dateTime.validator';
import parseDate from '../../parsers/date.parser';
/**
 *
 * @export
 * @param {string} value
 * @returns
 */

function isValidDateTime(value: ?Object) {
    return value && dateTimeValidator(value);
}
const convertDateTimeToMoment = (value: Object) =>  {
    const date = value.date;
    const time = value.time;
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
    momentDateTime.hour(hour);
    momentDateTime.minute(minutes);
    return momentDateTime;
};

const getDateTimeRangeValidator = (invalidDateTimeMessage: string) =>
    (value: { from?: ?Object, to?: ?Object}) => {
        const errorResult = [];
        if (!isValidDateTime(value.from)) {
            errorResult.push({ from: invalidDateTimeMessage });
        }

        if (!isValidDateTime(value.to)) {
            errorResult.push({ to: invalidDateTimeMessage });
        }

        if (errorResult.length > 0) {
            return {
                valid: false,
                errorMessage: errorResult.reduce((map, error) => ({ ...map, ...error }), {}),
            };
        }

        const fromDateTime = convertDateTimeToMoment(value.from);
        const toDateTime = convertDateTimeToMoment(value.to);
        return fromDateTime <= toDateTime;
    };

export default getDateTimeRangeValidator;
