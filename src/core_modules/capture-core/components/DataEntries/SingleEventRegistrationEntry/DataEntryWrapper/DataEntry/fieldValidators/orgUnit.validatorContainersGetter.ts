import { isValidOrgUnit } from 'capture-core-utils/validators/form';
import { customTerms } from '../../../../../../utils/customTerms';

const validateOrgUnit = (value?: any) => isValidOrgUnit(value);

export const getOrgUnitValidatorContainers = (orgUnitLabel: string) => [
    {
        validator: validateOrgUnit,
        errorMessage: customTerms.i18n.t('Please provide a valid {{orgUnitLabel}}', { orgUnitLabel }),
    },
];
