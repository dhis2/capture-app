// @flow
import type { Program, Icon } from '../../../../metaData';

const getOptionsFromPrograms = (
    programs: Array<Program>,
): Array<{
    value: string,
    label: string,
    icon?: Icon,
}> =>
    programs.map(program => ({
        label: program.name,
        value: program.id,
        icon: program.icon,
    }));

export const getOptions = (selectedOrgUnitId?: string, programsArray: Array<Program>) => {
    const programOptions = selectedOrgUnitId
        ? getOptionsFromPrograms(
            programsArray.filter(program => program.organisationUnits[selectedOrgUnitId] && program.access.data.read),
        )
        : getOptionsFromPrograms(programsArray.filter(program => program.access.data.read));

    return programOptions;
};
