// @flow
import i18n from '@dhis2/d2-i18n';
import { hasValue } from 'capture-core-utils/validators/form';
import { isValidDate, isValidNonFutureDate } from '../../../../utils/validators/form';

const isValidEnrollmentDate = (value: string, internalComponentError?: ?{error: ?string, errorCode: ?string}) => {
    if (!value) {
        return true;
    }

    return isValidDate(value, internalComponentError);
};

export const getEnrollmentDateValidatorContainer = () => {
    const validatorContainers = [
        {
            validator: hasValue,
            message:
                i18n.t('A value is required'),
        },
        {
            validator: isValidEnrollmentDate,
            message: i18n.t('Please provide a valid date'),
        },
        { validator: isValidNonFutureDate,
            message: i18n.t('A date in the future is not allowed'),
        },
    ];
    return validatorContainers;
};
