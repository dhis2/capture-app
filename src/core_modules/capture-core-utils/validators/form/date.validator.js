// @flow

/**
 *
 * @export
 * @param {string} value
 * @returns {ValidationResult}
 */

type ValidationResult = {|
    valid: boolean,
    errorMessage?: string,
|};

type InternalComponentError = ?{
    error?: ?string,
    errorCode?: ?string,
};

export function isValidDate(value: ?string, internalComponentError?: InternalComponentError): ValidationResult {
    if (!value) {
        return { valid: false };
    }

    if (internalComponentError && internalComponentError?.errorCode === 'INVALID_DATE_MORE_THAN_MAX') {
        return { valid: true };
    }

    if (internalComponentError?.error) {
        return {
            valid: false,
            errorMessage: internalComponentError?.error,
        };
    }

    return { valid: true };
}

