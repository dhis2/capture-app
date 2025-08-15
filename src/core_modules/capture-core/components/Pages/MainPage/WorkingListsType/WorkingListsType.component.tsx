import React from 'react';
import { useProgramInfo, programTypes } from '../../../../hooks/useProgramInfo';
import { EventWorkingListsInit } from '../EventWorkingListsInit';
import { TrackerWorkingLists } from '../../../WorkingLists/TrackerWorkingLists';
import type { Props } from './workingListsType.types';

export const WorkingListsType = ({
    programId,
    orgUnitId,
    selectedTemplateId,
    onChangeTemplate,
    onOpenBulkDataEntryPlugin,
}: Props) => {
    const { programType } = useProgramInfo(programId);
    if (programType === programTypes.EVENT_PROGRAM) {
        return <EventWorkingListsInit programId={programId} orgUnitId={orgUnitId} />;
    }

    if (programType === programTypes.TRACKER_PROGRAM) {
        return (
            <>
                <TrackerWorkingLists
                    programId={programId}
                    orgUnitId={orgUnitId}
                    selectedTemplateId={selectedTemplateId}
                    onChangeTemplate={onChangeTemplate}
                    onOpenBulkDataEntryPlugin={onOpenBulkDataEntryPlugin}
                />
            </>
        );
    }
    return null;
};
