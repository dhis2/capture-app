import { isValidOrgUnit } from 'capture-core-utils/validators/form';
import { tCustomTerm } from '../../../../utils/tCustomTerm';

const validateOrgUnit = (value?: any) => isValidOrgUnit(value);

export const getOrgUnitValidatorContainers = (orgUnitLabel: string) => [
    {
        validator: validateOrgUnit,
        errorMessage: tCustomTerm('Please provide a valid {{orgUnitLabel}}', { orgUnitLabel }),
    },
];
