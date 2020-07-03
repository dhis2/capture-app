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

function isValidNumberPart(value: ?string) {
    return !value || isValidZeroOrPositiveInteger(value);
}

function validateNumbers(years: ?string, months: ?string, days: ?string) {
    const errorResult = [];

    if (!isValidNumberPart(years)) {
        errorResult.push({ years: errorMessages.years });
    }
    if (!isValidNumberPart(months)) {
        errorResult.push({ months: errorMessages.months });
    }
    if (!isValidNumberPart(days)) {
        errorResult.push({ days: errorMessages.days });
    }

    if (errorResult.length > 0) {
        return {
            valid: false,
            // $FlowFixMe[exponential-spread] automated comment
            errorMessage: errorResult.reduce((map, error) => ({ ...map, ...error }), {}),
        };
    }
    return { valid: true };
}

function validateDate(date: ?string, dateFormat: string) {
    return (!date || isValidDate(date, dateFormat)) ?
        { valid: true } :
        { valid: false, errorMessage: { date: errorMessages.date } };
}

function isAllEmpty(value: AgeValues) {
    return (!value.date && !value.years && !value.months && !value.days);
}

export default function isValidAge(value: AgeValues, dateFormat: string) {
    if (isAllEmpty(value)) {
        return false;
    }

    const numberResult = validateNumbers(
        value.years,
        value.months,
        value.days,
    );

    if (!numberResult.valid) return numberResult;
    return validateDate(value.date, dateFormat);
}
