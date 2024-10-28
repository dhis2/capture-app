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

export function isValidDate(value: string, internalComponentError) {
    if (!value) {
        return false;
    }

    if (internalComponentError && internalComponentError?.errorCode === 'INVALID_DATE_MORE_THAN_MAX') {
        return true;
    }

    if (internalComponentError?.error) {
        return {
            valid: false,
            errorMessage: internalComponentError?.error,
        };
    }

    return { valid: true };
}

