import i18n from '@dhis2/d2-i18n';
import { isValidZeroOrPositiveInteger } from 'capture-core-utils/validators/form';
import { isValidDate } from './dateValidator';

type AgeValues = {
    date?: string | null;
    years?: string | null;
    months?: string | null;
    days?: string | null;
}

const errorMessages = {
    date: i18n.t('Please provide a valid date'),
    years: i18n.t('Please provide a valid positive integer'),
    months: i18n.t('Please provide a valid positive integer'),
    days: i18n.t('Please provide a valid positive integer'),

};

function isValidNumberPart(value: string | null | undefined) {
    return !value || isValidZeroOrPositiveInteger(value);
}

function validateNumbers(
    years: string | null | undefined,
    months: string | null | undefined,
    days: string | null | undefined
) {
    const errorResult: any[] = [];

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
            errorMessage: errorResult.reduce((map, error) => ({ ...map, ...error }), {}),
        };
    }
    return { valid: true };
}

function validateDate(
    date: string | null | undefined,
    internalComponentError?: {error?: string | null | undefined, errorCode?: string | null | undefined} | null | undefined
) {
    const { valid } = isValidDate(date, internalComponentError);
    return valid ?
        { valid: true } :
        { valid: false, errorMessage: { date: errorMessages.date } };
}

function isAllEmpty(value: AgeValues) {
    return (!value.date && !value.years && !value.months && !value.days);
}


export function isValidAge(
    value: any,
    internalComponentError?: {error?: string | null | undefined, errorCode?: string | null | undefined} | null | undefined
) {
    if (isAllEmpty(value)) {
        return false;
    }

    if (internalComponentError &&
        internalComponentError?.errorCode === 'INVALID_DATE_MORE_THAN_MAX') {
        return { valid: true, errorMessage: null };
    }

    const dateValidation = value.date
        ? validateDate(value.date, internalComponentError)
        : { valid: true, errorMessage: null };

    if (!dateValidation.valid) {
        return dateValidation;
    }

    return validateNumbers(
        value.years,
        value.months,
        value.days,
    );
}
