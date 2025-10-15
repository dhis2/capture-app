import type { ApiEnrollmentEvent } from 'capture-core-utils/types/api-types';
import { actionCreator } from '../../../actions/actions.utils';
import { effectMethods } from '../../../trackerOffline';

export const batchActionTypes = {
    START_SAVE_EDIT_EVENT_DATA_ENTRY_BATCH: 'StartSaveEditEventDataEntryBatchForViewSingleEvent',
    SAVE_EDIT_EVENT_DATA_ENTRY_FAILED: 'SaveEditEventDataEntryBatchFailed',
};


export const actionTypes = {
    CANCEL_EDIT_EVENT_DATA_ENTRY: 'CancelEditEventDataEntryForViewSingleEvent',
    REQUEST_SAVE_EDIT_EVENT_DATA_ENTRY: 'RequestSaveEditEventDataEntryForViewSingleEvent',
    START_SAVE_EDIT_EVENT_DATA_ENTRY: 'StartSaveEditEventDataEntryForViewSingleEvent',
    EDIT_EVENT_DATA_ENTRY_SAVED: 'EditEventDataEntrySavedForViewSingleEvent',
    SAVE_EDIT_EVENT_DATA_ENTRY_FAILED: 'SaveEditEventDataEntryFailedForViewSingleEvent',
    PREREQUISITES_ERROR_LOADING_EDIT_EVENT_DATA_ENTRY: 'PrerequisitesErrorLoadingEditEventDataEntryForViewSingleEvent',
    REQUEST_DELETE_EVENT_DATA_ENTRY: 'RequestDeleteEventDataEntry',
    START_DELETE_EVENT_DATA_ENTRY: 'StartDeleteEventDataEntry',
    DELETE_EVENT_DATA_ENTRY_FAILED: 'DeleteEventDataEntryFailed',
    DELETE_EVENT_DATA_ENTRY_SUCCEEDED: 'DeleteEventDataEntrySucceeded',
    EVENT_SCHEDULE_SUCCESS: 'ScheduleEvent.UpdateScheduleEventSuccess',
    EVENT_SCHEDULE_ERROR: 'ScheduleEvent.UpdateScheduleEventError',
    START_CREATE_NEW_AFTER_COMPLETING: 'WidgetEventEdit.StartCreateNewAfterCompleting',
    EVENT_SAVE_ENROLLMENT_COMPLETE_REQUEST: 'WidgetEventEdit.EventSaveAndEnrollmentCompleteRequest',
};

export const cancelEditEventDataEntry = () =>
    actionCreator(actionTypes.CANCEL_EDIT_EVENT_DATA_ENTRY)();

export const requestSaveEditEventDataEntry = (itemId: string, dataEntryId: string, formFoundation: any) =>
    actionCreator(actionTypes.REQUEST_SAVE_EDIT_EVENT_DATA_ENTRY)(
        { itemId, dataEntryId, formFoundation },
        { skipLogging: ['formFoundation'] },
    );

export const startSaveEditEventDataEntry = (
    eventId: string,
    serverData: any,
    triggerActionCommit?: string | null,
    triggerActionRollback?: string | null,
) =>
    actionCreator(actionTypes.START_SAVE_EDIT_EVENT_DATA_ENTRY)(
        {},
        {
            offline: {
                effect: {
                    url: 'tracker?async=false&importStrategy=UPDATE',
                    method: effectMethods.POST,
                    data: serverData,
                },
                commit: {
                    type: actionTypes.EDIT_EVENT_DATA_ENTRY_SAVED,
                    meta: { eventId, triggerAction: triggerActionCommit },
                },
                rollback: {
                    type: actionTypes.SAVE_EDIT_EVENT_DATA_ENTRY_FAILED,
                    meta: { eventId, triggerAction: triggerActionRollback },
                },
            },
        },
    );

export const prerequisitesErrorLoadingEditEventDataEntry = (message: string) =>
    actionCreator(actionTypes.PREREQUISITES_ERROR_LOADING_EDIT_EVENT_DATA_ENTRY)(message);

export const requestDeleteEventDataEntry = ({ eventId, enrollmentId }: { eventId: string; enrollmentId: string }) =>
    actionCreator(actionTypes.REQUEST_DELETE_EVENT_DATA_ENTRY)({ eventId, enrollmentId });

export const startDeleteEventDataEntry = (serverData: any, eventId: string, params: any) =>
    actionCreator(actionTypes.START_DELETE_EVENT_DATA_ENTRY)({ eventId }, {
        offline: {
            effect: {
                url: 'tracker?async=false&importStrategy=DELETE',
                method: effectMethods.POST,
                data: serverData,
            },
            commit: {
                type: actionTypes.DELETE_EVENT_DATA_ENTRY_SUCCEEDED,
                meta: { eventId, params },
            },
            rollback: {
                type: actionTypes.DELETE_EVENT_DATA_ENTRY_FAILED,
                meta: { eventId, params },
            },
        },
    });


export const startCreateNewAfterCompleting = ({ enrollmentId, isCreateNew, orgUnitId, programId, teiId, availableProgramStages }: any) =>
    actionCreator(actionTypes.START_CREATE_NEW_AFTER_COMPLETING)({ enrollmentId, isCreateNew, orgUnitId, programId, teiId, availableProgramStages });

export const requestSaveAndCompleteEnrollment = ({
    itemId,
    dataEntryId,
    formFoundation,
    onSaveAndCompleteEnrollmentExternal,
    onSaveAndCompleteEnrollmentSuccessActionType,
    onSaveAndCompleteEnrollmentErrorActionType,
    enrollment,
}: {
    itemId: string;
    dataEntryId: string;
    formFoundation: any;
    onSaveAndCompleteEnrollmentExternal?: (enrollmnet: ApiEnrollmentEvent) => void;
    onSaveAndCompleteEnrollmentSuccessActionType?: string;
    onSaveAndCompleteEnrollmentErrorActionType?: string;
    enrollment: any;
}) =>
    actionCreator(actionTypes.EVENT_SAVE_ENROLLMENT_COMPLETE_REQUEST)(
        {
            itemId,
            dataEntryId,
            formFoundation,
            onSaveAndCompleteEnrollmentExternal,
            onSaveAndCompleteEnrollmentSuccessActionType,
            onSaveAndCompleteEnrollmentErrorActionType,
            enrollment,
        },
        { skipLogging: ['formFoundation'] },
    );

