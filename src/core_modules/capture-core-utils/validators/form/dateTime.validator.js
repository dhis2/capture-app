// @flow
import i18n from '@dhis2/d2-i18n';
import { isValidDate } from './date.validator';
import { isValidTime } from './time.validator';
// import { errorMessages } from 'capture-core/components/D2Form/field/validators/getValidators';

const CUSTOM_TIME_VALIDATION_MESSAGES = {
    INVALID_TIME: i18n.t('Please provide a valid time'),
};

type DateTimeValue = {
    date?: ?string,
    time?: ?string,
};

// eslint-disable-next-line complexity
export function isValidDateTime(value: DateTimeValue, dateFormat: string) {
    if (!value) return { valid: false, errorMessage: {} };

    const { date, time } = value;

    if (!date && !time) {
        return { valid: true, errorMessage: null };
    }

    let dateIsValid = true;
    let timeIsValid = true;
    let dateErrorMessage = {};
    let timeErrorMessage = {};

    if (time) {
        timeIsValid = isValidTime(time);
        if (!timeIsValid) {
            timeErrorMessage = { timeInnerErrorMessage: CUSTOM_TIME_VALIDATION_MESSAGES.INVALID_TIME };
        }
    }

    if (date) {
        const dateValidation = isValidDate(date, dateFormat);
        dateIsValid = dateValidation.valid;
        dateErrorMessage = dateValidation.errorMessage || {};
    }

    const isValid = (date ? dateIsValid : true) && (time ? timeIsValid : true);

    return {
        valid: isValid,
        errorMessage: {
            ...dateErrorMessage,
            ...timeErrorMessage,
        },
    };
}
