// @flow
import i18n from '@dhis2/d2-i18n';

type Validator = (value: any,
    internalComponentError?: ?{error: ?string, errorCode: ?string}) =>
        boolean | { valid: boolean, errorMessage?: ?string } | { valid: boolean, message?: ?string };

export type ValidatorContainer = {
    validator: Validator,
    message: string,
};

export function getValidationError(value: any, validatorContainers: ?Array<ValidatorContainer>, internalComponentError?: ?{error: ?string, errorCode: ?string}) {
    if (!validatorContainers) {
        return null;
    }

    let message;
    const errorEncountered = validatorContainers.some((validatorContainer) => {
        const validator = validatorContainer.validator;
        const result = validator(value, internalComponentError);

        if (result === true || (result && result.valid)) {
            return false;
        }

        message = (result && result.errorMessage) || (result && result.message) || validatorContainer.message;
        return true;
    });


    return (errorEncountered ? (message || i18n.t('validation failed')) : null);
}
