// @flow

import { actionCreator } from '../../../actions/actions.utils';
import type { UserFormField } from '../../FormFields/UserField';

export const actionTypes = {
    ASSIGNEE_SET: 'EnrollmentDomain.AssigneeSet',
    ASSIGNEE_SAVE_FAILED: 'EnrollmentDomain.AssigneeSaveFailed',
};

export const setAssignee = (assignedUser?: ApiAssignedUser, assignee: UserFormField | null, eventId: string) =>
    actionCreator(actionTypes.ASSIGNEE_SET)({ assignedUser, assignee, eventId });

export const rollbackAssignee = (assignedUser?: ApiAssignedUser, assignee: UserFormField | null, eventId: string) =>
    actionCreator(actionTypes.ASSIGNEE_SAVE_FAILED)({ assignedUser, assignee, eventId });
