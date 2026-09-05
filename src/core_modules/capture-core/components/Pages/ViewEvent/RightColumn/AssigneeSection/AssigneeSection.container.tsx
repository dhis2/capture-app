import React from 'react';
import type { ApiEnrollmentEvent } from 'capture-core-utils/types/api-types';
import { WidgetAssignee } from '../../../../WidgetAssignee';
import type { ProgramStage } from '../../../../../metaData';
import type { UserFormField } from '../../../../FormFields/UserField';

type Props = {
    assignee: UserFormField | null;
    programStage?: ProgramStage | null;
    readOnly: boolean;
    getAssignedUserSaveContext: () => { event: ApiEnrollmentEvent };
    onSaveAssignee: (newAssignee: UserFormField) => void;
    onSaveAssigneeError: (prevAssignee: UserFormField | null) => void;
};

export const AssigneeSection = ({
    assignee,
    programStage,
    getAssignedUserSaveContext,
    readOnly,
    onSaveAssignee,
    onSaveAssigneeError,
}: Props) => (
    <WidgetAssignee
        enabled={programStage?.enableUserAssignment || false}
        assignee={assignee}
        getSaveContext={getAssignedUserSaveContext}
        readOnly={readOnly}
        onSave={onSaveAssignee}
        onSaveError={onSaveAssigneeError}
    />
);
