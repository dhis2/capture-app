// @flow
import isValidZeroOrPositiveInteger from './integerZeroOrPositive.validator';
import isValidDate from './date.validator';
/**
 *
 * @export
 * @param {string} value
 * @returns
 */

type AgeValues = {
    date?: ?string,
    years?: ?string,
    months?: ?string,
    days?: ?string,
}

const errorMessages = {
    date: 'Please provide a valid date',
    years: 'Please provide a valid positive integer',
    months: 'Please provide a valid positive integer',
    days: 'Please provide a valid positive integer',

};

function getValueOrEmptyString(value: ?string) {
    return value || '';
}

function validateNumbers(years: string, months: string, days: string) {
    const errorResult = [];

    if (!isValidZeroOrPositiveInteger(years, true)) {
        errorResult.push({ years: errorMessages.years });
    }
    if (!isValidZeroOrPositiveInteger(months, true)) {
        errorResult.push({ months: errorMessages.years });
    }
    if (!isValidZeroOrPositiveInteger(days, true)) {
        errorResult.push({ days: errorMessages.years });
    }

    if (errorResult.length > 0) {
        return {
            valid: false,
            errorMessage: errorResult.reduce((map, error) => ({ ...map, ...error }), {}),
        };
    }
    return { valid: true };
}

function validateDate(date: string) {
    return isValidDate(date, true) ?
        { valid: true } :
        { valid: false, errorMessage: { date: errorMessages.date },
        };
}

export default function isValidAge(value: ?AgeValues, isEmptyValid: boolean = false) {
    if (!value || (!value.date && !value.years && !value.months && !value.days)) {
        return isEmptyValid;
    }
    const numberResult = validateNumbers(
        getValueOrEmptyString(value.years),
        getValueOrEmptyString(value.months),
        getValueOrEmptyString(value.days),
    );

    if (!numberResult.valid) return numberResult;
    return validateDate(getValueOrEmptyString(value.date));
}
