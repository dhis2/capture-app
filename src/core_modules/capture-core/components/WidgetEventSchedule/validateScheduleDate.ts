import i18n from '@dhis2/d2-i18n';
import { hasValue } from 'capture-core-utils/validators/form';
import { isValidDate, isValidPeriod } from '../../utils/validation/validators/form';
import { convertFormToClient } from '../../converters';
import { dataElementTypes } from '../../metaData';
import type { InternalComponentError, Validation } from './widgetEventSchedule.types';

type ExpiryPeriod = {
    expiryPeriodType?: string | null;
    expiryDays?: number | null;
};

export const validateScheduleDate = (
    dateString: string | null | undefined,
    expiryPeriod?: ExpiryPeriod,
    internalComponentError?: InternalComponentError,
): Validation => {
    if (!hasValue(dateString)) {
        return {
            error: true,
            validationText: i18n.t('A value is required'),
        };
    }

    const dateValidation = isValidDate(dateString, internalComponentError);
    const clientDate = convertFormToClient(dateString, dataElementTypes.DATE) as string;
    if (!dateValidation.valid || !clientDate) {
        return {
            error: true,
            validationText: dateValidation.errorMessage || i18n.t('Please provide a valid date'),
        };
    }

    if (expiryPeriod) {
        const { isWithinValidPeriod, firstValidDate } = isValidPeriod(clientDate, expiryPeriod);
        if (!isWithinValidPeriod) {
            return {
                error: true,
                validationText: i18n.t(
                    'The date entered belongs to an expired period. '
                        + 'Enter a date after {{firstValidDate}}.',
                    { firstValidDate, interpolation: { escapeValue: false } },
                ),
            };
        }
    }

    return {
        error: false,
        validationText: '',
    };
};
