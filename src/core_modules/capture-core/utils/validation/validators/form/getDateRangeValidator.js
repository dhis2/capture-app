// @flow
import { Temporal } from '@js-temporal/polyfill';
import { isValidDate } from './dateValidator';
import { convertLocalToIsoCalendar } from '../../../converters/date';
/**
 *
 * @export
 * @param {string} value
 * @returns {boolean}
 */

function isValidDateWithEmptyCheck(value: ?string, internalError?: ?{error: ?string, errorCode: ?string}) {
    return isValidDate(value, internalError);
}

export const getDateRangeValidator = (invalidDateMessage: string) =>
    (value: { from?: ?string, to?: ?string}, internalComponentError?: ?{fromError: ?{error: ?string, errorCode: ?string}, toError: ?{error: ?string, errorCode: ?string}}) => {
        const errorResult = [];
        if (!isValidDateWithEmptyCheck(value.from, internalComponentError?.fromError).valid) {
            errorResult.push({ from: invalidDateMessage });
        }

        if (!isValidDateWithEmptyCheck(value.to, internalComponentError?.toError).valid) {
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
        const isoFrom = convertLocalToIsoCalendar(from);
        const isoTo = convertLocalToIsoCalendar(to);

        if (!isoFrom || !isoTo) {
            return {
                valid: false,
                errorMessage: { date: invalidDateMessage },
            };
        }

        const fromDate = Temporal.PlainDate.from(isoFrom.split('T')[0]);
        const toDate = Temporal.PlainDate.from(isoTo.split('T')[0]);

        return {
            valid: Temporal.PlainDate.compare(fromDate, toDate) <= 0,
            errorMessage: undefined,
        };
    };
