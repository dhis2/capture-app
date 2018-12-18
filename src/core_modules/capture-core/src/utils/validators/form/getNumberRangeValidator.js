// @flow

/**
 *
 * @export
 * @param {string} value
 * @returns
 */

function getNumberRangeValidator(validatorContainer: Object) {
    return (value: { from?: string, to?: string}) => {
        const errorResult = [];
        if (!validatorContainer.validator(value.from)) {
            errorResult.push({ from: validatorContainer.message });
        }
        if (!validatorContainer.validator(value.to)) {
            errorResult.push({ to: validatorContainer.message });
        }
        if (errorResult.length > 0) {
            return {
                valid: false,
                errorMessage: errorResult.reduce((map, error) => ({ ...map, ...error }), {}),
            };
        }
        return true;
    };
}

export default getNumberRangeValidator;
