import { isValidOrgUnit } from 'capture-core-utils/validators/form';
import i18n from '@dhis2/d2-i18n';

const validateOrgUnit = (value?: Record<string, unknown>) => isValidOrgUnit(value);

export const getOrgUnitValidatorContainers = (orgUnitLabel: string) => [
    {
        validator: validateOrgUnit,
        errorMessage: i18n.t('Please provide a valid {{orgUnitLabel}}', { orgUnitLabel }),
    },
];
