import type { ValidatorContainer } from './getValidators';

export type Validations = {
    valid: boolean;
    errorMessage?: string | null;
    errorType?: string | null;
    errorData?: any;
};

export const validateValue = async ({
    validators,
    value,
    postProcessAsyncValidatonInitiation,
    commitOptions,
}: {
    validators?: Array<ValidatorContainer>;
    value: any;
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
            let errorMessage = currentValidator.message;
            if (result) {
                if ('errorMessage' in result) {
                    errorMessage = result.errorMessage || currentValidator.message;
                } else if ('message' in result) {
                    errorMessage = result.message || currentValidator.message;
                }
            }
            return {
                message: errorMessage,
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
