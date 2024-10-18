// @flow

/**
 *
 * @export
 * @param {string} value
 * @param {string} format
 * @returns {boolean}
 */

import i18n from '@dhis2/d2-i18n';
/**
 *
 * @export
 * @param {string} value
 * @returns {boolean}
 */
const CUSTOM_VALIDATION_MESSAGES = {
    // WRONG_FORMAT: i18n.t('Please provide a valid date'),
    INVALID_DATE_MORE_THAN_MAX: i18n.t('A date in the future is not allowed'),
};

const getErrorMessage = (errorCode: string, errorMessage: string): ?string => {
    if (!errorMessage) return undefined;

    return CUSTOM_VALIDATION_MESSAGES[errorCode] || errorMessage || undefined;
};

export function isValidDate(value: string, internalError) {
    if (internalError.innerError) {
        return {
            valid: false,
            errorMessage: {
                dateInnerErrorMessage: getErrorMessage(internalError.innerErrorCode, internalError.innerError) 
            } };
    }

    return { valid: true };
}

