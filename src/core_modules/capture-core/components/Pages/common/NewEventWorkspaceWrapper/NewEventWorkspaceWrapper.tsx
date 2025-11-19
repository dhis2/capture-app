import React from 'react';
import { ProgramStageSelector } from '../../EnrollmentAddEvent/ProgramStageSelector';
import { NewEventWorkspace } from '../../EnrollmentAddEvent/NewEventWorkspace';
import type { WrapperProps } from '../../EnrollmentAddEvent/NewEventWorkspace/newEventWorkspace.types';

export const NewEventWorkspaceWrapper = ({
    stageId,
    programId,
    orgUnitId,
    teiId,
    enrollmentId,
    dataEntryHasChanges = false,
    widgetReducerName = '',
    rulesExecutionDependencies = {},
    onSave = () => undefined,
    onCancel = () => undefined,
    ...passOnProps
}: WrapperProps) => {
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
            dataEntryHasChanges={dataEntryHasChanges}
            widgetReducerName={widgetReducerName}
            rulesExecutionDependencies={rulesExecutionDependencies}
            onSave={onSave}
            onCancel={onCancel}
            {...passOnProps}
        />
    );
};
