import { isValidOrgUnit } from 'capture-core-utils/validators/form';
import i18n from '@dhis2/d2-i18n';

const validateOrgUnit = (value?: any) => isValidOrgUnit(value);

type Labels = { orgUnit?: string };

export const getOrgUnitValidatorContainers = ({ orgUnit }: Labels = {}) => {
    const orgUnitLabel = orgUnit ?? i18n.t('organisation unit');
    const validatorContainers = [
        {
            validator: validateOrgUnit,
            errorMessage: i18n.t('Please provide a valid {{orgUnit}}', {
                orgUnit: orgUnitLabel,
                interpolation: { escapeValue: false },
            }),
        },
    ];
    return validatorContainers;
};
