// @flow
import React, { useMemo } from 'react';
import i18n from '@dhis2/d2-i18n';
import {
    OptionsSelectVirtualized,
} from '../../../../../FormFields/Options/SelectVirtualizedV2/OptionsSelectVirtualized.component';
import { withDefaultFieldContainer, withLabel } from '../../../../../FormFields/New';
import type { Props } from './programSelector.types';

const ProgramSelector = withDefaultFieldContainer()(withLabel()(OptionsSelectVirtualized));

const programFieldStyles = {
    labelContainerStyle: {
        paddingTop: 12,
        flexBasis: 200,
    },
    inputContainerStyle: {
        flexBasis: 150,
    },
};

export const ProgramSelectorForTrackedEntityFinder = ({
    selectedProgramId,
    onSelectProgram,
    getPrograms,
    trackedEntityTypeId,
}: Props) => {
    const options = useMemo(() => (getPrograms ?
        getPrograms(trackedEntityTypeId)
            .map(({ id, name }) => ({ label: name, value: id })) : []),
    [getPrograms, trackedEntityTypeId]);

    return (
        <ProgramSelector
            styles={programFieldStyles}
            options={options}
            onSelect={onSelectProgram}
            label={i18n.t('Selected program')}
            value={selectedProgramId}
        />
    );
};
