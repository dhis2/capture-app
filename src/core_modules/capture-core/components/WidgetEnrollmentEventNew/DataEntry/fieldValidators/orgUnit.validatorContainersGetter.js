// @flow
import { isValidOrgUnit, isValidOrgUnitInProgram } from 'capture-core-utils/validators/form';
import i18n from '@dhis2/d2-i18n';

const validateOrgUnit = (value?: ?Object) => isValidOrgUnit(value);

export const getOrgUnitValidatorContainers = (props?: ?Object) => {
    const validatorContainers = [
        {
            validator: validateOrgUnit,
            errorMessage: i18n.t('Please provide an valid organisation unit'),
        },
        {
            validator: (value?: ?Object) => isValidOrgUnitInProgram(value, props),
            errorMessage: i18n.t('The selected organisation unit does not belong to the chosen program'),
        },
    ];
    return validatorContainers;
};
