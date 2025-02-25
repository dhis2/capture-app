// @flow
import i18n from '@dhis2/d2-i18n';
import { isValidTime } from 'capture-core-utils/validators/form';
import { isValidDate } from './dateValidator';

type DateTimeValue = {
    date?: ?string,
    time?: ?string,
};

type ValidationResult = {
    valid: boolean,
    errorMessage?: {
        timeError?: ?string,
        dateError?: ?string
    },
    data?: any,
};

const CUSTOM_VALIDATION_MESSAGES = {
    INVALID_TIME: i18n.t('Please enter a valid time'),
    MISSING_TIME: i18n.t('Please enter a time'),
    MISSING_DATE: i18n.t('Please enter a date'),
};

export function isValidDateTime(value: ?DateTimeValue,
    internalComponentError?: ?{error: ?string, errorCode: ?string}): ValidationResult {
    if (!value) {
        return { valid: true };
    }

    const { date, time } = value;
    let dateError = '';
    let timeError = '';
    let isValid = true;

    if (!date) {
        dateError = CUSTOM_VALIDATION_MESSAGES.MISSING_DATE;
        isValid = false;
    } else {
        const dateValidation = isValidDate(date, internalComponentError);
        if (!dateValidation.valid) {
            dateError = dateValidation?.errorMessage;
            isValid = false;
        }
    }

    if (!time) {
        timeError = CUSTOM_VALIDATION_MESSAGES.MISSING_TIME;
        isValid = false;
    } else if (!isValidTime(time)) {
        timeError = CUSTOM_VALIDATION_MESSAGES.INVALID_TIME;
        isValid = false;
    }

    return {
        valid: isValid,
        errorMessage: {
            timeError,
            dateError,
        },
    };
}
