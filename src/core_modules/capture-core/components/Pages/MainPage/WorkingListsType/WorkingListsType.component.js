// @flow
import React from 'react';
import { useProgramInfo, programTypes } from '../../../../hooks/useProgramInfo';
import { EventWorkingListsInit } from '../EventWorkingListsInit';
import { TeiWorkingLists } from '../TeiWorkingLists';
import type { Props } from './workingListsType.types';

export const WorkingListsType = ({ programId }: Props) => {
    const { programType } = useProgramInfo(programId);

    if (programType === programTypes.EVENT_PROGRAM) {
        return (
            <EventWorkingListsInit />
        );
    }

    return (
        <TeiWorkingLists />
    );
};
