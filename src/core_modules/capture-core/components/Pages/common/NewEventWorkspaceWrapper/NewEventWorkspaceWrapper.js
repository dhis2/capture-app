// @flow

import React from 'react';
import { ProgramStageSelector } from '../../EnrollmentAddEvent/ProgramStageSelector';
import { NewEventWorkspace } from '../../EnrollmentAddEvent/NewEventWorkspace';
import type { Props } from '../../EnrollmentAddEvent/NewEventWorkspace/newEventWorkspace.types';

export const NewEventWorkspaceWrapper = ({
    stageId,
    programId,
    orgUnitId,
    teiId,
    enrollmentId,
    ...passOnProps
}: Props) => {
    if (!stageId) {
        return (
            <ProgramStageSelector
                programId={programId}
                orgUnitId={orgUnitId}
                teiId={teiId}
                enrollmentId={enrollmentId}
            />
        );
    }

    return (
        <NewEventWorkspace
            programId={programId}
            stageId={stageId}
            orgUnitId={orgUnitId}
            teiId={teiId}
            enrollmentId={enrollmentId}
            {...passOnProps}
        />
    );
};
