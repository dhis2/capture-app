// @flow
import i18n from '@dhis2/d2-i18n';
import { hasValue } from 'capture-core-utils/validators/form';
import { isValidDate, isValidNonFutureDate } from '../../../../utils/validation/validators/form';

const isValidIncidentDate = (value: string, internalComponentError?: {error: string| null, errorCode: string | null}| null) => {
    if (!value) {
        return true;
    }

    return isValidDate(value, internalComponentError);
};


export const getIncidentDateValidatorContainer = () => {
    const validatorContainers = [
        {
            validator: hasValue,
            errorMessage:
                i18n.t('A value is required'),
        },
        {
            validator: isValidIncidentDate,
            errorMessage: i18n.t('Please provide a valid date'),
        },
        { validator: isValidNonFutureDate,
            errorMessage: i18n.t('A date in the future is not allowed'),
        },
    ];
    return validatorContainers;
};
