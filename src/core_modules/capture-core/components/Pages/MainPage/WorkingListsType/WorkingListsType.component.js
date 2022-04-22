// @flow
import React from 'react';
import { useProgramInfo, programTypes } from '../../../../hooks/useProgramInfo';
import { EventWorkingListsInit } from '../EventWorkingListsInit';
import { TeiWorkingLists } from '../../../WorkingLists/TeiWorkingLists';
import type { Props } from './workingListsType.types';

export const WorkingListsType = ({ programId, orgUnitId, selectedTemplateId }: Props) => {
    const { programType } = useProgramInfo(programId);
    if (programType === programTypes.EVENT_PROGRAM) {
        return (
            <EventWorkingListsInit
                programId={programId}
                orgUnitId={orgUnitId}
            />
        );
    }

    return (
        <TeiWorkingLists programId={programId} orgUnitId={orgUnitId} selectedTemplateId={selectedTemplateId} />
    );
};
