import { hasValue } from 'capture-core-utils/validators/form';
import i18n from '@dhis2/d2-i18n';
import { isValidDate, isValidPeriod } from '../../../../../../utils/validation/validators/form';

const preValidateDate = (
    value?: string,
    internalComponentError?: any,
) => {
    if (!value) {
        return true;
    }

    return isValidDate(value, internalComponentError);
};

const validateNotExpired = (
    value: string,
    props: any,
) => {
    if (!value || !props.expiryPeriod) {
        return true;
    }
    const { isWithinValidPeriod, firstValidDate } = isValidPeriod(value, props.expiryPeriod);

    return {
        valid: isWithinValidPeriod,
        errorMessage: i18n.t('The date entered belongs to an expired period. Enter a date after {{firstValidDate}}.', {
            firstValidDate,
            interpolation: { escapeValue: false },
        }),
    };
};

export const getEventDateValidatorContainers = (props?: any) => [
    {
        validator: hasValue,
        errorMessage: i18n.t('A value is required'),
    },
    {
        validator: preValidateDate,
        errorMessage: i18n.t('Please provide a valid date'),
    },
    {
        validator: (value: string) => validateNotExpired(value, props),
        errorMessage: '',
    },
];
