// @flow

import { actionCreator } from '../../actions/actions.utils';
import { effectMethods } from '../../trackerOffline';
import type { UserFormField } from '../FormFields/UserField';

export const actionTypes = {
    WIDGET_ASSIGNEE_SET: 'ViewEventAssigneeSet',
    WIDGET_ASSIGNEE_SAVE: 'ViewEventAssigneeSave',
    WIDGET_ASSIGNEE_SAVE_COMPLETED: 'ViewEventAssigneeSaveCompleted',
    WIDGET_ASSIGNEE_SAVE_FAILED: 'ViewEventAssigneeSaveFailed',
};

export const setAssignee = (
    eventId: string,
    serverData: { events: Array<ApiEnrollmentEvent> },
    assignee: UserFormField,
) => actionCreator(actionTypes.WIDGET_ASSIGNEE_SET)({ eventId, serverData, assignee });

export const saveAssignee = ({
    eventId,
    serverData,
    assignee,
    assignedUser,
}: {
    eventId: string,
    serverData: { events: Array<ApiEnrollmentEvent> },
    assignee: UserFormField | null,
    assignedUser?: ApiAssignedUser,
}) =>
    actionCreator(actionTypes.WIDGET_ASSIGNEE_SAVE)(
        {},
        {
            offline: {
                effect: {
                    url: 'tracker?async=false&importStrategy=UPDATE',
                    method: effectMethods.POST,
                    data: serverData,
                },
                commit: {
                    type: actionTypes.WIDGET_ASSIGNEE_SAVE_COMPLETED,
                    meta: { eventId },
                },
                rollback: {
                    type: actionTypes.WIDGET_ASSIGNEE_SAVE_FAILED,
                    meta: { eventId, assignee, assignedUser },
                },
            },
        },
    );
