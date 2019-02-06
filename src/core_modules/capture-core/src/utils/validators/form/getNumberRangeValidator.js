// @flow
import parseNumber from '../../parsers/number.parser';
/**
 *
 * @export
 * @param {string} value
 * @returns
 */


function isValid(value: any, validatorContainer: Object) {
    return value && validatorContainer.validator(value);
}

function getNumberRangeValidator(validatorContainer: Object) {
    return (value: { from?: any, to?: any}) => {
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
                errorMessage: errorResult.reduce((map, error) => ({ ...map, ...error }), {}),
            };
        }
        // $FlowFixMe
        return parseNumber(value.from) <= parseNumber(value.to);
    };
}

export default getNumberRangeValidator;
