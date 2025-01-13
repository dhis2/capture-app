// @flow
import { Temporal } from '@js-temporal/polyfill';
import { isValidDate } from './dateValidator';
import { convertStringToDateFormat } from '../../../converters/date';
/**
 *
 * @export
 * @param {string} value
 * @returns {boolean}
 */

function isValidDateWithEmptyCheck(value: ?string) {
    return value && isValidDate(value);
}

export const getDateRangeValidator = (invalidDateMessage: string) =>
    (value: { from?: ?string, to?: ?string}) => {
        const errorResult = [];
        if (!isValidDateWithEmptyCheck(value.from)) {
            errorResult.push({ from: invalidDateMessage });
        }

        if (!isValidDateWithEmptyCheck(value.to)) {
            errorResult.push({ to: invalidDateMessage });
        }

        if (errorResult.length > 0) {
            return {
                valid: false,
                // $FlowFixMe[exponential-spread] automated comment
                errorMessage: errorResult.reduce((map, error) => ({ ...map, ...error }), {}),
            };
        }
        const { from, to } = value;
        // $FlowFixMe
        const formattedFrom = convertStringToDateFormat(from, 'YYYY-MM-DD');
        const fromattedTo = convertStringToDateFormat(to, 'YYYY-MM-DD');
        return Temporal.PlainDate.compare(formattedFrom, fromattedTo) <= 0;
    };
