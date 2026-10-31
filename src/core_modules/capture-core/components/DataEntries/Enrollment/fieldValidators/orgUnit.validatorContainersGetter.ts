import { isValidOrgUnit } from 'capture-core-utils/validators/form';
import i18n from '@dhis2/d2-i18n';
import { getProgramThrowIfNotFound } from '../../../../metaData';

const validateOrgUnit = (value?: any) => isValidOrgUnit(value);

export const getOrgUnitValidatorContainers = (orgUnitLabel: string, programId: string) => {
    const program = getProgramThrowIfNotFound(programId);
    const validateOrgUnitInProgram = (value?: any) => !value || !!program.organisationUnits[value.id];

    return [
        {
            validator: validateOrgUnit,
            errorMessage: i18n.t('Please provide a valid {{orgUnitLabel}}', { orgUnitLabel }),
        },
        {
            validator: validateOrgUnitInProgram,
            errorMessage: i18n.t('The selected {{orgUnitLabel}} can\'t collect data for {{programName}}', {
                programName: program.name,
                orgUnitLabel,
                interpolation: { escapeValue: false },
            }),
        },
    ];
};
