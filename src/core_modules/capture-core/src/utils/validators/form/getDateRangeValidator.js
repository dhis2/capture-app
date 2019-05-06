// @flow
import dateValidator from './date.validator';
import parseDate from '../../parsers/date.parser';
/**
 *
 * @export
 * @param {string} value
 * @returns
 */

function isValidDate(value: ?string) {
    return value && dateValidator(value);
}

const getDateRangeValidator = (invalidDateMessage: string) =>
    (value: { from?: ?string, to?: ?string}) => {
        const errorResult = [];
        if (!isValidDate(value.from)) {
            errorResult.push({ from: invalidDateMessage });
        }

        if (!isValidDate(value.to)) {
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

export default getDateRangeValidator;
