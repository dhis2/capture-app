// @flow
import { hasValue } from 'capture-core-utils/validators/form';
import i18n from '@dhis2/d2-i18n';
import { isValidDate, isValidPeriod } from '../../../../utils/validation/validators/form';
import { convertFormToClient } from '../../../../converters';
import { dataElementTypes } from '../../../../metaData';

const preValidateDate = (
    value?: ?string,
    internalComponentError?: ?{error: ?string, errorCode: ?string},
) => {
    if (!value) {
        return true;
    }

    return isValidDate(value, internalComponentError);
};

const validateNotExpired = (
    value?: ?string,
    props: Object,
) => {
    if (!value || !props?.expiryPeriod) {
        return true;
    }
    const occurredAtClient = ((convertFormToClient(value, dataElementTypes.DATE): any): string);
    const { isWithinValidPeriod, firstValidDate } = isValidPeriod(occurredAtClient, props.expiryPeriod);

    return {
        valid: isWithinValidPeriod,
        errorMessage: i18n.t('The date entered belongs to an expired period. Enter a date after {{firstValidDate}}.', {
            firstValidDate,
            interpolation: { escapeValue: false },
        }),
    };
};

export const getEventDateValidatorContainers = (props: Object) => [
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

