import type { ValidatorContainer } from './getValidators';

const extractErrorMessage = (result: any, defaultMessage: string): string => {
    if (!result) return defaultMessage;
    if ('errorMessage' in result) return result.errorMessage || defaultMessage;
    if ('message' in result) return result.message || defaultMessage;
    return defaultMessage;
};

export type Validations = {
    valid: boolean;
    errorMessage?: string | null;
    errorType?: string | null;
    errorData?: any;
};

export const validateValue = async ({
    validators,
    value,
    validationContext,
    postProcessAsyncValidatonInitiation,
    commitOptions,
}: {
    validators?: Array<ValidatorContainer>;
    value: any;
    validationContext?: any | null;
    postProcessAsyncValidatonInitiation?: any;
    commitOptions?: any | null;
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
                commitOptions,
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
                message: extractErrorMessage(result, currentValidator.message),
                type: currentValidator.type,
                data: result && ('data' in result ? (result as any).data : undefined),
            };
        }
        return pass;
    }, Promise.resolve(true as any));

    if (validatorResult !== true) {
        return {
            valid: false,
            errorMessage: (validatorResult as any).message,
            errorType: (validatorResult as any).type,
            errorData: (validatorResult as any).data,
        };
    }

    return {
        valid: true,
    };
};
