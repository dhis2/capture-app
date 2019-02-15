// @flow
import timeValidator from './time.validator';
import moment from '../../../utils/moment/momentResolver';
import parseDate from '../../parsers/date.parser';
/**
 *
 * @export
 * @param {string} value
 * @returns
 */

function isValidTime(value: ?string) {
    return value && timeValidator(value);
}

const convertTimeToMoment = (value: string, baseDate: any) => {
    let hour;
    let minutes;
    if (/[:.]/.test(value)) {
        [hour, minutes] = value.split(/[:.]/);
    } else if (value.length === 3) {
        hour = value.substring(0, 1);
        minutes = value.substring(2, 3);
    } else {
        hour = value.substring(0, 2);
        minutes = value.substring(3, 4);
    }
    const momentDateTime = moment(baseDate);
    // $FlowFixMe
    momentDateTime.hour(hour);
    // $FlowFixMe
    momentDateTime.minute(minutes);
    return momentDateTime;
};

const getTimeRangeValidator = (invalidTimeMessage: string) =>
    (value: { from?: ?string, to?: ?string}) => {
        const errorResult = [];
        if (!isValidTime(value.from)) {
            errorResult.push({ from: invalidTimeMessage });
        }

        if (!isValidTime(value.to)) {
            errorResult.push({ to: invalidTimeMessage });
        }

        if (errorResult.length > 0) {
            return {
                valid: false,
                errorMessage: errorResult.reduce((map, error) => ({ ...map, ...error }), {}),
            };
        }
        const baseDate = moment();

        // $FlowFixMe
        const fromParsed = convertTimeToMoment(value.from, baseDate);
        // $FlowFixMe
        const toParsed = convertTimeToMoment(value.to, baseDate);
        // $FlowFixMe
        return fromParsed <= toParsed;
    };

export default getTimeRangeValidator;
