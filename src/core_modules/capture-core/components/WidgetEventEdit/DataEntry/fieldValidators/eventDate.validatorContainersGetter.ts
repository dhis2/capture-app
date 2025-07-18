import i18n from '@dhis2/d2-i18n';
import { hasValue } from 'capture-core-utils/validators/form';
import { isValidDate } from '../../../../utils/validation/validators/form';

const preValidateDate = (value?: string, internalComponentError?: {error?: string, errorCode?: string}) => {
    if (!value) {
        return true;
    }

    return isValidDate(value, internalComponentError);
};

export const getEventDateValidatorContainers = () => {
    const validatorContainers = [
        {
            validator: hasValue,
            errorMessage: i18n.t('A value is required'),
        },
        {
            validator: preValidateDate,
            errorMessage: i18n.t('Please provide a valid date'),
        },
    ];
    return validatorContainers;
};
