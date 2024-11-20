// @flow
import i18n from '@dhis2/d2-i18n';
import { isValidZeroOrPositiveInteger } from 'capture-core-utils/validators/form';
import { isValidDate } from './dateValidator';

type AgeValues = {
    date?: ?string,
    years?: ?string,
    months?: ?string,
    days?: ?string,
}

const errorMessages = {
    date: i18n.t('Please provide a valid date'),
    years: i18n.t('Please provide a valid positive integer'),
    months: i18n.t('Please provide a valid positive integer'),
    days: i18n.t('Please provide a valid positive integer'),

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

function validateDate(date: ?string, internalComponentError?: ?{error: ?string, errorCode: ?string}) {
    const { valid } = isValidDate(date, internalComponentError);
    return valid ?
        { valid: true } :
        { valid: false, errorMessage: { date: errorMessages.date } };
}

function isAllEmpty(value: AgeValues) {
    return (!value.date && !value.years && !value.months && !value.days);
}


export function isValidAge(value: Object, internalComponentError?: Object) {
    if (isAllEmpty(value)) {
        return false;
    }

    const numberResult = validateNumbers(
        value.years,
        value.months,
        value.days,
    );

    if (!numberResult.valid) return numberResult;

    return validateDate(value.date, internalComponentError);
}
