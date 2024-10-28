// @flow
import { isValidDate } from './date.validator';
import { isValidTime } from './time.validator';
import i18n from '@dhis2/d2-i18n';

type DateTimeValue = {
    date?: ?string,
    time?: ?string,
};

type ValidationResult = {
    valid: boolean,
    errorMessage: {
        timeError: string,
        dateError: string
    }
};

const CUSTOM_VALIDATION_MESSAGES = {
    INVALID_TIME: i18n.t('Please enter a valid time'),
    MISSING_TIME: i18n.t('Please enter a time'),
    MISSING_DATE: i18n.t('Please enter a date'),
};

const validateDate = (
    date: ?string, 
    validation: ValidationResult, 
    internalComponentError?: ?Object
): void => {
    if (!date) {
        validation.valid = false;
        validation.errorMessage.dateError = CUSTOM_VALIDATION_MESSAGES.MISSING_DATE;
        return;
    }

    const { valid, errorMessage } = isValidDate(date, internalComponentError);
    if (!valid) {
        validation.valid = false;
        validation.errorMessage.dateError = errorMessage;
    }
};

const validateTime = (time: ?string, validation: ValidationResult): void => {
    if (!time) {
        validation.valid = false;
        validation.errorMessage.timeError = CUSTOM_VALIDATION_MESSAGES.MISSING_TIME;
        return;
    }

    if (!isValidTime(time)) {
        validation.valid = false;
        validation.errorMessage.timeError = CUSTOM_VALIDATION_MESSAGES.INVALID_TIME;
    }
};

export function isValidDateTime(
    value: DateTimeValue, 
    internalComponentError?: ?Object
): ValidationResult {
    if (!value) {
        return createValidationResult(false);
    }

    const validation = {
        valid: true,
        errorMessage: {
            timeError: '',
            dateError: '',
        },
    };

    const { date, time } = value;

    validateDate(date, validation, internalComponentError);
    validateTime(time, validation);

    return validation;
}
