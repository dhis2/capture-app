// @flow
type Validator = (value: any) => boolean;

export type ValidatorContainer = {
    validator: Validator,
    message: string,
};

export function getValidationErrors(value: any, validatorContainers: ?Array<ValidatorContainer>) {
    if (!validatorContainers) {
        return [];
    }

    return validatorContainers.reduce((accErrors, validatorContainer) => {
        const validator = validatorContainer.validator;
        const isValid = validator(value);
        if (!isValid) {
            accErrors.push(validatorContainer.message);
        }
        return accErrors;
    }, []);
}
