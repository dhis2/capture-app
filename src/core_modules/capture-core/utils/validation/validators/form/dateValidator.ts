export function isValidDate(
    value: string | null | undefined,
    internalComponentError?: {error?: string | null | undefined, errorCode?: string | null | undefined} | null | undefined
) {
    if (!value) {
        return { valid: false, errorMessage: null };
    }

    if (internalComponentError &&
        internalComponentError?.errorCode === 'INVALID_DATE_MORE_THAN_MAX') {
        return { valid: true, errorMessage: null };
    }

    if (internalComponentError?.error) {
        return {
            valid: false,
            errorMessage: internalComponentError?.error,
        };
    }

    return { valid: true, errorMessage: null };
}
