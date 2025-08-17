import { parseNumber } from 'capture-core-utils/parsers';

function isValid(value: any, validatorContainer: any) {
    return value && validatorContainer.validator(value);
}

export const getNumberRangeValidator = (validatorContainer: any) =>
    (value: { from?: any, to?: any}) => {
        const errorResult: any[] = [];

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
        return parseNumber(value.from) <= parseNumber(value.to);
    };
