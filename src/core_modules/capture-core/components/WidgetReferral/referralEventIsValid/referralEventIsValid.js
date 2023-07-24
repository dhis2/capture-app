// @flow
import i18n from '@dhis2/d2-i18n';
import { isValidDate, isValidOrgUnit } from '../../../../capture-core-utils/validators/form';
import { systemSettingsStore } from '../../../metaDataMemoryStores';
import type { ReferralIsValidProps } from './referralEventIsValid.types';

export const isScheduledDateValid = (scheduledDate: string) => {
    const dateFormat = systemSettingsStore.get().dateFormat;
    return isValidDate(scheduledDate, dateFormat);
};
export const referralWidgetIsValid = ({ scheduledAt, orgUnit, setErrorMessages }: ReferralIsValidProps): boolean => {
    const scheduledAtIsValid = !!scheduledAt && isScheduledDateValid(scheduledAt);
    const orgUnitIsValid = isValidOrgUnit(orgUnit);

    if (!scheduledAtIsValid) {
        setErrorMessages({
            scheduledAt: i18n.t('Please provide a valid date'),
        });
    } else {
        setErrorMessages({
            scheduledAt: null,
        });
    }

    if (!orgUnitIsValid) {
        setErrorMessages({
            orgUnit: i18n.t('Please provide a valid organisation unit'),
        });
    } else {
        setErrorMessages({
            orgUnit: null,
        });
    }

    return scheduledAtIsValid && orgUnitIsValid;
};
