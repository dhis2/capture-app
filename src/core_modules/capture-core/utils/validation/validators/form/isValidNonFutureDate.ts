import i18n from '@dhis2/d2-i18n';

const CUSTOM_VALIDATION_MESSAGES = {
    INVALID_DATE_MORE_THAN_MAX: i18n.t('A date in the future is not allowed'),
};

export const isValidNonFutureDate = (
    value: string,
    internalComponentError?: {error?: string | null | undefined, errorCode?: string | null | undefined} | null | undefined,
) => {
    if (!value) {
        return true;
    }

    if (internalComponentError && internalComponentError?.errorCode === 'INVALID_DATE_MORE_THAN_MAX') {
        return {
            valid: false,
            errorMessage: CUSTOM_VALIDATION_MESSAGES.INVALID_DATE_MORE_THAN_MAX,
        };
    }

    return true;
};
