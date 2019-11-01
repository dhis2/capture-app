// @flow
import { isValidDate } from './dateValidator';
import { parseDate } from '../../converters/date';
/**
 *
 * @export
 * @param {string} value
 * @returns
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
                errorMessage: errorResult.reduce((map, error) => ({ ...map, ...error }), {}),
            };
        }
        // $FlowFixMe
        return parseDate(value.from).momentDate <= parseDate(value.to).momentDate;
    };
