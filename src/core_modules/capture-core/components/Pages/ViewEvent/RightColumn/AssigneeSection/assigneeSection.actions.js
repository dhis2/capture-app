// @flow

import { actionCreator } from '../../../../../actions/actions.utils';
import { effectMethods } from '../../../../../trackerOffline';

export const actionTypes = {
  VIEW_EVENT_ASSIGNEE_SET: 'ViewEventAssigneeSet',
  VIEW_EVENT_ASSIGNEE_SAVE: 'ViewEventAssigneeSave',
  VIEW_EVENT_ASSIGNEE_SAVE_COMPLETED: 'ViewEventAssigneeSaveCompleted',
  VIEW_EVENT_ASSIGNEE_SAVE_FAILED: 'ViewEventAssigneeSaveFailed',
};

export const setAssignee = (assignee: Object) =>
  actionCreator(actionTypes.VIEW_EVENT_ASSIGNEE_SET)({ assignee });

export const saveAssignee = (eventId: string, serverData: Object, selections: Object) =>
  actionCreator(actionTypes.VIEW_EVENT_ASSIGNEE_SAVE)(
    {},
    {
      offline: {
        effect: {
          url: `events/${eventId}`,
          method: effectMethods.UPDATE,
          data: serverData,
        },
        commit: {
          type: actionTypes.VIEW_EVENT_ASSIGNEE_SAVE_COMPLETED,
          meta: { eventId, selections },
        },
        rollback: {
          type: actionTypes.VIEW_EVENT_ASSIGNEE_SAVE_FAILED,
          meta: { eventId, selections },
        },
      },
    },
  );
