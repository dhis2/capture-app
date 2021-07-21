// @flow
import React from 'react';
import { useProgramInfo, programTypes } from '../../../../hooks/useProgramInfo';
import { EventWorkingListsInit } from '../EventWorkingListsInit';
import { TeiWorkingLists } from '../../../TeiWorkingLists';
import type { Props } from './workingListsType.types';

export const WorkingListsType = ({ programId, orgUnitId }: Props) => {
    const { program, programType } = useProgramInfo(programId);
    if (programType === programTypes.EVENT_PROGRAM) {
        const programStageId = [...program.stages.keys()][0];
        return (
            <EventWorkingListsInit
                programId={programId}
                programStageId={programStageId}
                orgUnitId={orgUnitId}
            />
        );
    }

    return (
        <TeiWorkingLists programId={programId} orgUnitId={orgUnitId} />
    );
};
