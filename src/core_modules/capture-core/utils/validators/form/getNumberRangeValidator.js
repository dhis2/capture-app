// @flow
import { parseNumber } from 'capture-core-utils/parsers';
/**
 *
 * @export
 * @param {string} value
 * @returns {boolean}
 */


function isValid(value: any, validatorContainer: Object) {
    return value && validatorContainer.validator(value);
}

export const getNumberRangeValidator = (validatorContainer: Object) =>
    (value: { from?: any, to?: any}) => {
        const errorResult = [];

        if (!isValid(value.from, validatorContainer)) {
            errorResult.push({ from: validatorContainer.message });
        }
        if (!isValid(value.to, validatorContainer)) {
            errorResult.push({ to: validatorContainer.message });
        }
        if (errorResult.length > 0) {
            return {
                valid: false,
                // $FlowFixMe[exponential-spread] automated comment
                errorMessage: errorResult.reduce((map, error) => ({ ...map, ...error }), {}),
            };
        }
        // $FlowFixMe
        return parseNumber(value.from) <= parseNumber(value.to);
    };
