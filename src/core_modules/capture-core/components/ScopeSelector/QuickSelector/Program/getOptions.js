// @flow
import * as React from 'react';
import type { Program } from '../../../../metaData';
import { NonBundledDhis2Icon } from '../../../NonBundledDhis2Icon';

const getProgramIcon = ({ icon: { color, name } = {}, name: programName }: Program) => (
    <NonBundledDhis2Icon
        name={name || 'clinical_fe_outline'}
        color={color || '#e0e0e0'}
        alternativeText={programName}
        width={22}
        height={22}
        cornerRadius={2}
    />
);

const getOptionsFromPrograms = (
    programs: Array<Program>,
): Array<{
    value: string,
    label: string,
    icon?: React.Node,
}> =>
    programs.map(program => ({
        label: program.name,
        value: program.id,
        icon: getProgramIcon(program),
    }));

export const getOptions = (selectedOrgUnitId?: string, programsArray: Array<Program>) => {
    const programOptions = selectedOrgUnitId
        ? getOptionsFromPrograms(
            programsArray.filter(program => program.organisationUnits[selectedOrgUnitId] && program.access.data.read),
        )
        : getOptionsFromPrograms(programsArray.filter(program => program.access.data.read));

    return programOptions;
};
