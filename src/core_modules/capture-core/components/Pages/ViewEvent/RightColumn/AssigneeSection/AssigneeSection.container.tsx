import React from 'react';
import { WidgetAssignee } from '../../../../WidgetAssignee';
import type { PlainProps } from './AssigneeSection.types';

export const AssigneeSection = ({
    assignee,
    programStage,
    getAssignedUserSaveContext,
    eventAccess,
    onSaveAssignee,
    onSaveAssigneeError,
}: PlainProps) => (
    <WidgetAssignee
        enabled={programStage?.enableUserAssignment || false}
        assignee={assignee}
        getSaveContext={getAssignedUserSaveContext}
        writeAccess={eventAccess?.write || false}
        onSave={onSaveAssignee}
        onSaveError={onSaveAssigneeError}
    />
);
