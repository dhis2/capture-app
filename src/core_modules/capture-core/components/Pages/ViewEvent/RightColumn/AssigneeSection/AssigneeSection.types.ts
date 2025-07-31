import type { ProgramStage } from '../../../../../metaData';
import type { UserFormField } from '../../../../FormFields/UserField';
import type { ApiEnrollmentEvent } from '../../../../../../capture-core-utils/types/api-types';

export type PlainProps = {
    assignee: UserFormField | null;
    programStage?: ProgramStage | null;
    eventAccess: {
        read: boolean;
        write: boolean;
    } | null;
    getAssignedUserSaveContext: () => { event: ApiEnrollmentEvent };
    onSaveAssignee: (newAssignee: UserFormField) => void;
    onSaveAssigneeError: (prevAssignee: UserFormField | null) => void;
};
