// @flow
import React from 'react';
import { useProgramInfo, programTypes } from '../../../../hooks/useProgramInfo';
import { EventWorkingListsInit } from '../EventWorkingListsInit';
import { TeiWorkingLists } from '../../../WorkingLists/TeiWorkingLists';
import type { Props } from './workingListsType.types';

export const WorkingListsType = ({ programId, orgUnitId, selectedTemplateId, onChangeTemplate }: Props) => {
    const { programType } = useProgramInfo(programId);
    if (programType === programTypes.EVENT_PROGRAM) {
        return <EventWorkingListsInit programId={programId} orgUnitId={orgUnitId} />;
    }

    if (programType === programTypes.TRACKER_PROGRAM) {
        return (
            <>
                <TeiWorkingLists
                    programId={programId}
                    orgUnitId={orgUnitId}
                    selectedTemplateId={selectedTemplateId}
                    onChangeTemplate={onChangeTemplate}
                />
            </>
        );
    }
    return null;
};
