// @flow
import { actionCreator } from '../../../actions/actions.utils';
import { effectMethods } from '../../../trackerOffline';

export const newEventWidgetActionTypes = {
    RULES_ON_UPDATE_EXECUTE: 'NewEvent.ExecuteRulesOnUpdate',
    EVENT_SAVE_REQUEST: 'NewEvent.RequestSaveEvent',
    EVENT_SAVE: 'NewEvent.SaveEvent',
    EVENT_SAVE_SUCCESS: 'NewEvent.SaveEventSuccess',  // TEMPORARY - pass in success action name to the widget
    EVENT_SAVE_ERROR: 'NewEvent.SaveEventError', // TEMPORARY - pass in error action name to the widget
    EVENT_NOTE_ADD: 'NewEvent.AddEventNote',
};

export const requestSaveEvent = ({
    eventId,
    dataEntryId,
    formFoundation,
    teiId,
    enrollmentId,
    completed,
    onSaveActionType,
}: {
    eventId: string,
    dataEntryId: string,
    formFoundation: Object,
    teiId: string,
    enrollmentId: string,
    completed?: boolean,
    onSaveActionType?: string,
}) =>
    actionCreator(newEventWidgetActionTypes.EVENT_SAVE_REQUEST)({
        eventId,
        dataEntryId,
        formFoundation,
        teiId,
        enrollmentId,
        completed,
        onSaveActionType,
    }, { skipLogging: ['formFoundation'] });

export const saveEvent = (serverData: Object, relationshipData: ?Object, selections: Object) => {
    const actionType = newEventWidgetActionTypes.EVENT_SAVE;
    return actionCreator(actionType)({ selections }, {
        offline: {
            effect: {
                url: 'events',
                method: effectMethods.POST,
                data: serverData,
            },
            commit: { type: newEventWidgetActionTypes.EVENT_SAVE_SUCCESS, meta: { selections, relationshipData, triggerAction: actionType } },
            rollback: { type: newEventWidgetActionTypes.EVENT_SAVE_ERROR, meta: { selections } },
        },
    });
};

export const saveEventCallbackAction = (onSaveActionType: string, serverData: Object) =>
    actionCreator(onSaveActionType)({ serverData });
