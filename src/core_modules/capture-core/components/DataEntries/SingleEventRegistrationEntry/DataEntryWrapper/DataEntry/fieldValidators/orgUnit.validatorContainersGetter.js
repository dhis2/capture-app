// @flow
import { isValidOrgUnit } from 'capture-core-utils/validators/form';
import i18n from '@dhis2/d2-i18n';

const validateOrgUnit = (value?: ?Object) => isValidOrgUnit(value);

export const getOrgUnitValidatorContainers = () => {
    const validatorContainers = [
        {
            validator: validateOrgUnit,
            errorMessage: i18n.t('Please provide an valid organisation unit'),
        },
    ];
    return validatorContainers;
};
