import { actionCreator } from '../../../actions/actions.utils';
import type { UserFormField } from '../../FormFields/UserField';
import type { ApiAssignedUser } from '../../../flow/apiTypes';

export const actionTypes = {
    ASSIGNEE_SET: 'EnrollmentDomain.AssigneeSet',
    ASSIGNEE_SAVE_FAILED: 'EnrollmentDomain.AssigneeSaveFailed',
    EVENT_SAVE_ENROLLMENT_COMPLETE_SUCCESS: 'EditEnrollmentEventPage.EventSaveAndEnrollmentCompleteSuccess',
    EVENT_SAVE_ENROLLMENT_COMPLETE_ERROR: 'EditEnrollmentEventPage.EventSaveAndEnrollmentCompleteError',
};

export const setAssignee = (assignedUser: ApiAssignedUser | undefined, assignee: UserFormField | null, eventId: string) =>
    actionCreator(actionTypes.ASSIGNEE_SET)({ assignedUser, assignee, eventId });

export const rollbackAssignee = (assignedUser: ApiAssignedUser | undefined, assignee: UserFormField | null, eventId: string) =>
    actionCreator(actionTypes.ASSIGNEE_SAVE_FAILED)({ assignedUser, assignee, eventId });
