// @flow
import React from 'react';
import { WidgetAssignee } from '../../../../WidgetAssignee';
import type { ProgramStage } from '../../../../../metaData';
import type { UserFormField } from '../../../../FormFields/UserField';

type Props = {|
    assignee: UserFormField | null,
    programStage: ?ProgramStage,
    eventAccess: {|
        read: boolean,
        write: boolean,
    |} | null,
    getAssignedUserSaveContext: () => { event: ApiEnrollmentEvent },
    onSaveAssignee: (newAssignee: UserFormField) => void,
    onSaveAssigneeError: (prevAssignee: UserFormField | null) => void,
|};

export const AssigneeSection = ({
    assignee,
    programStage,
    getAssignedUserSaveContext,
    eventAccess,
    onSaveAssignee,
    onSaveAssigneeError,
}: Props) => (
    <WidgetAssignee
        enabled={programStage?.enableUserAssignment || false}
        assignee={assignee}
        getSaveContext={getAssignedUserSaveContext}
        writeAccess={eventAccess?.write || false}
        onSave={onSaveAssignee}
        onSaveError={onSaveAssigneeError}
    />
);
