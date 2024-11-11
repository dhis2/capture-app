// @flow
import { hasValue } from 'capture-core-utils/validators/form';
import i18n from '@dhis2/d2-i18n';

const CUSTOM_VALIDATION_MESSAGES = {
    INVALID_DATE_MORE_THAN_MAX: i18n.t('A date in the future is not allowed'),
};

const isValidIncidentDate = (value: string, internalComponentError) => {
    if (!internalComponentError || !internalComponentError?.error) {
        return { valid: true };
    }

    if (internalComponentError?.error) {
        return {
            valid: false,
            errorMessage: internalComponentError?.errorCode === 'INVALID_DATE_MORE_THAN_MAX' ?
                CUSTOM_VALIDATION_MESSAGES.INVALID_DATE_MORE_THAN_MAX :
                internalComponentError?.error,
        };
    }

    return true;
};


export const getIncidentDateValidatorContainer = () => {
    const validatorContainers = [
        {
            validator: hasValue,
            message:
                i18n.t('A value is required'),
        },
        {
            validator: (value: string, internalComponentError) => isValidIncidentDate(value, internalComponentError),
            message: i18n.t('Please provide a valid date'),
        },
    ];
    return validatorContainers;
};
