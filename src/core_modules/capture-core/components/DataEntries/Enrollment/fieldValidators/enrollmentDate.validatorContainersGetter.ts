import i18n from '@dhis2/d2-i18n';
import { hasValue } from 'capture-core-utils/validators/form';
import {
    isValidDate,
    isValidNonFutureDate,
    getWithinOrgUnitDateRangeValidator,
} from '../../../../utils/validation/validators/form';
import type { OrgUnitDateRange } from '../../../../utils/orgUnits/getOrgUnitCalendarBounds';

const isValidEnrollmentDate = (value: string, internalComponentError?: {error?: string, errorCode?: string}) => {
    if (!value) {
        return true;
    }

    return isValidDate(value, internalComponentError);
};

export const getEnrollmentDateValidatorContainer = (orgUnit?: OrgUnitDateRange | null, orgUnitLabel?: string | null) => {
    const validatorContainers = [
        {
            validator: hasValue,
            errorMessage:
                i18n.t('A value is required'),
        },
        {
            validator: isValidEnrollmentDate,
            errorMessage: i18n.t('Please provide a valid date'),
        },
        { validator: isValidNonFutureDate,
            errorMessage: i18n.t('A date in the future is not allowed'),
        },
        {
            validator: getWithinOrgUnitDateRangeValidator(orgUnit, orgUnitLabel),
            errorMessage: '',
        },
    ];
    return validatorContainers;
};
