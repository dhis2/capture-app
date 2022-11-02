// @flow
import { actionCreator } from '../../../actions/actions.utils';
import { effectMethods } from '../../../trackerOffline';
import type { ExternalSaveHandler } from '../common.types';

export const newEventWidgetActionTypes = {
    RULES_ON_UPDATE_EXECUTE: 'NewEvent.ExecuteRulesOnUpdate',
    EVENT_SAVE_REQUEST: 'NewEvent.RequestSaveEvent',
    EVENT_SAVE: 'NewEvent.SaveEvent',
    EVENT_SAVE_SUCCESS: 'NewEvent.SaveEventSuccess',  // TEMPORARY - pass in success action name to the widget
    EVENT_SAVE_ERROR: 'NewEvent.SaveEventError', // TEMPORARY - pass in error action name to the widget
    EVENT_NOTE_ADD: 'NewEvent.AddEventNote',
    START_CREATE_NEW_AFTER_COMPLETING: 'NewEvent.StartCreateNewAfterCompleting',
};

export const requestSaveEvent = ({
    eventId,
    dataEntryId,
    formFoundation,
    programId,
    orgUnitId,
    orgUnitName,
    teiId,
    enrollmentId,
    completed,
    onSaveExternal,
    onSaveSuccessActionType,
    onSaveErrorActionType,
}: {
    eventId: string,
    dataEntryId: string,
    formFoundation: Object,
    programId: string,
    orgUnitId: string,
    orgUnitName: string,
    teiId: string,
    enrollmentId: string,
    completed?: boolean,
    onSaveExternal?: ExternalSaveHandler,
    onSaveSuccessActionType?: string,
    onSaveErrorActionType?: string,
}) =>
    actionCreator(newEventWidgetActionTypes.EVENT_SAVE_REQUEST)({
        eventId,
        dataEntryId,
        formFoundation,
        programId,
        orgUnitId,
        orgUnitName,
        teiId,
        enrollmentId,
        completed,
        onSaveExternal,
        onSaveSuccessActionType,
        onSaveErrorActionType,
    }, { skipLogging: ['formFoundation'] });

export const saveEvent = (serverData: Object, onSaveSuccessActionType?: string, onSaveErrorActionType?: string, uid: string) =>
    actionCreator(newEventWidgetActionTypes.EVENT_SAVE)({}, {
        offline: {
            effect: {
                url: 'tracker?async=false',
                method: effectMethods.POST,
                data: serverData,
            },
            commit: onSaveSuccessActionType && { type: onSaveSuccessActionType, meta: { serverData, uid } },
            rollback: onSaveErrorActionType && { type: onSaveErrorActionType, meta: { serverData, uid } },
        },
    });
export const startCreateNewAfterCreating = ({ enrollmentId, isCreateNew, orgUnitId, programId, teiId }: Object) =>
    actionCreator(newEventWidgetActionTypes.START_CREATE_NEW_AFTER_COMPLETING)({ enrollmentId, isCreateNew, orgUnitId, programId, teiId });
