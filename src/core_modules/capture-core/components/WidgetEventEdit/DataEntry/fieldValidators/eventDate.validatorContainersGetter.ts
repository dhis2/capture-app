import i18n from '@dhis2/d2-i18n';
import { hasValue } from 'capture-core-utils/validators/form';
import {
    isValidDate,
    isValidPeriod,
    getWithinOrgUnitDateRangeValidator,
} from '../../../../utils/validation/validators/form';
import { convertFormToClient } from '../../../../converters';
import { dataElementTypes } from '../../../../metaData';
import { getOrgUnitLabel } from '../../../../utils/orgUnits/getOrgUnitLabel';

const preValidateDate = (value?: string, internalComponentError?: {error?: string, errorCode?: string}) => {
    if (!value) {
        return true;
    }

    return isValidDate(value, internalComponentError);
};

const validateNotExpired = (
    value?: string | null,
    props?: Record<string, unknown>,
) => {
    if (!value || !props?.expiryPeriod) {
        return true;
    }
    const occurredAtClient = convertFormToClient(value, dataElementTypes.DATE) as string;
    const { isWithinValidPeriod, firstValidDate } = isValidPeriod(occurredAtClient, props.expiryPeriod);
    return {
        valid: isWithinValidPeriod,
        errorMessage: i18n.t('The date entered belongs to an expired period. Enter a date after {{firstValidDate}}.', {
            firstValidDate,
            interpolation: { escapeValue: false },
        }),
    };
};

export const getEventDateValidatorContainers = (props: Record<string, unknown> = {}) => [
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
    {
        // The message is built by the validator itself (it interpolates the org unit's
        // opening/closing dates and label), so the static fallback is intentionally empty.
        validator: getWithinOrgUnitDateRangeValidator(
            props?.orgUnit as { openingDate?: string, closedDate?: string },
            getOrgUnitLabel(props?.programId as string | undefined),
        ),
        errorMessage: '',
    },
];
