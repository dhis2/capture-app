// @flow
import type { ValidatorContainer } from './getValidators';
import type { FieldCommitOptionsExtended } from '../../components/D2Form';

export type Validations = {
    valid: boolean,
    errorMessage?: ?string,
    errorType?: ?string,
    errorData?: Object,
};

export const validateValue = async ({
    validators,
    value,
    validationContext,
    postProcessAsyncValidatonInitiation,
    commitOptions,
}: {
    validators?: Array<ValidatorContainer>,
    value: any,
    validationContext: ?Object,
    postProcessAsyncValidatonInitiation?: Function,
    commitOptions?: ?FieldCommitOptionsExtended,
}): Promise<Validations> => {
    if (!validators || validators.length === 0) {
        return {
            valid: true,
        };
    }

    const validatorResult = await validators.reduce(async (passPromise, currentValidator) => {
        const pass = await passPromise;
        if (pass === true) {
            let result = currentValidator.validator(
                value,
                { error: commitOptions?.error, errorCode: commitOptions?.errorCode },
                validationContext,
            );
            if (result instanceof Promise) {
                result = postProcessAsyncValidatonInitiation
                    ? postProcessAsyncValidatonInitiation(currentValidator.validatingMessage, result)
                    : result;
                result = await result;
            }

            if (result === true || (result && result.valid)) {
                return true;
            }
            return {
                message: (result && result.errorMessage) || currentValidator.message,
                type: currentValidator.type,
                data: result && result.data,
            };
        }
        return pass;
    }, Promise.resolve(true));

    if (validatorResult !== true) {
        return {
            valid: false,
            errorMessage: validatorResult.message,
            errorType: validatorResult.type,
            errorData: validatorResult.data,
        };
    }

    return {
        valid: true,
    };
};
