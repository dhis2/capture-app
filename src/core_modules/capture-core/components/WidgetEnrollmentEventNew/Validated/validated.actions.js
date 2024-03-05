// @flow
import { actionCreator } from '../../../actions/actions.utils';
import { effectMethods } from '../../../trackerOffline';
import { actions as RelatedStageModes } from '../../WidgetRelatedStages/constants';
import type { RequestEvent } from './validated.types';
import type { ExternalSaveHandler } from '../common.types';

export const newEventBatchActionTypes = {
    REQUEST_SAVE_AND_SET_SUBMISSION_IN_PROGRESS: 'NewEvent.RequestSaveAndSetSubmissionInProgress',
};

export const newEventWidgetActionTypes = {
    RULES_ON_UPDATE_EXECUTE: 'NewEvent.ExecuteRulesOnUpdate',
    EVENT_SAVE_REQUEST: 'NewEvent.RequestSaveEvent',
    EVENT_SAVE: 'NewEvent.SaveEvent',
    EVENT_SAVE_SUCCESS: 'NewEvent.SaveEventSuccess',  // TEMPORARY - pass in success action name to the widget
    EVENT_SAVE_ERROR: 'NewEvent.SaveEventError', // TEMPORARY - pass in error action name to the widget
    EVENT_NOTE_ADD: 'NewEvent.AddEventNote',
    START_CREATE_NEW_AFTER_COMPLETING: 'NewEvent.StartCreateNewAfterCompleting',
    SET_SAVE_ENROLLMENT_EVENT_IN_PROGRESS: 'NewEvent.SetSaveEnrollmentEventInProgress',
    CLEAN_UP_EVENT_SAVE_IN_PROGRESS: 'NewEvent.CleanUpDataEntry',
    EVENT_SAVE_ENROLLMENT_COMPLETE_REQUEST: 'NewEvent.EventSaveAndEnrollmentCompleteRequest',
    EVENT_SAVE_ENROLLMENT_COMPLETE: 'NewEvent.EventSaveAndEnrollmentComplete',
};

export const requestSaveEvent = ({
    requestEvent,
    linkedEvent,
    relationship,
    linkMode,
    onSaveExternal,
    onSaveSuccessActionType,
    onSaveErrorActionType,
}: {
    requestEvent: RequestEvent,
    linkedEvent?: Object,
    relationship?: Object,
    linkMode: ?$Keys<typeof RelatedStageModes>,
    onSaveExternal: ?ExternalSaveHandler,
    onSaveSuccessActionType?: string,
    onSaveErrorActionType?: string,
}) =>
    actionCreator(newEventWidgetActionTypes.EVENT_SAVE_REQUEST)({
        requestEvent,
        linkedEvent,
        relationship,
        linkMode,
        onSaveExternal,
        onSaveSuccessActionType,
        onSaveErrorActionType,
    }, { skipLogging: ['formFoundation'] });

export const setSaveEnrollmentEventInProgress = ({
    requestEventId,
    linkedEventId,
    linkedOrgUnitId,
    linkMode,
}: {
    requestEventId: string,
    linkedEventId: ?string,
    linkedOrgUnitId: ?string,
    linkMode: ?$Keys<typeof RelatedStageModes>,
}) => actionCreator(newEventWidgetActionTypes.SET_SAVE_ENROLLMENT_EVENT_IN_PROGRESS)({
    requestEventId,
    linkedEventId,
    linkedOrgUnitId,
    linkMode,
});

export const saveEvents = ({ serverData, onSaveErrorActionType, onSaveSuccessActionType }: Object) =>
    actionCreator(newEventWidgetActionTypes.EVENT_SAVE)({}, {
        offline: {
            effect: {
                url: 'tracker?async=false',
                method: effectMethods.POST,
                data: serverData,
            },
            commit: onSaveSuccessActionType && { type: onSaveSuccessActionType, meta: { serverData } },
            rollback: onSaveErrorActionType && { type: onSaveErrorActionType, meta: { serverData } },
        },
    });

export const startCreateNewAfterCompleting = ({ enrollmentId, isCreateNew, orgUnitId, programId, teiId, availableProgramStages }: Object) =>
    actionCreator(newEventWidgetActionTypes.START_CREATE_NEW_AFTER_COMPLETING)({ enrollmentId, isCreateNew, orgUnitId, programId, teiId, availableProgramStages });


export const requestSaveAndCompleteEnrollment = ({
    eventId,
    dataEntryId,
    formFoundation,
    programId,
    orgUnitId,
    orgUnitName,
    teiId,
    enrollmentId,
    completed,
    fromClientDate,
    onSaveAndCompleteEnrollmentExternal,
    onSaveAndCompleteEnrollmentSuccessActionType,
    onSaveAndCompleteEnrollmentErrorActionType,
    enrollment,
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
    fromClientDate: (date: Date) => { getServerZonedISOString: () => string },
    onSaveAndCompleteEnrollmentExternal?: (enrollmnet: ApiEnrollment) => void,
    onSaveAndCompleteEnrollmentSuccessActionType?: string,
    onSaveAndCompleteEnrollmentErrorActionType?: string,
    enrollment: Object,
}) =>
    actionCreator(newEventWidgetActionTypes.EVENT_SAVE_ENROLLMENT_COMPLETE_REQUEST)(
        {
            eventId,
            dataEntryId,
            formFoundation,
            programId,
            orgUnitId,
            orgUnitName,
            teiId,
            enrollmentId,
            completed,
            fromClientDate,
            onSaveAndCompleteEnrollmentExternal,
            onSaveAndCompleteEnrollmentSuccessActionType,
            onSaveAndCompleteEnrollmentErrorActionType,
            enrollment,
        },
        { skipLogging: ['formFoundation'] },
    );

export const saveEventAndCompleteEnrollment = (
    serverData: Object,
    onCompleteEnrollmentSuccessActionType?: string,
    onCompleteEnrollmentErrorActionType?: string,
    uid: string,
) =>
    actionCreator(newEventWidgetActionTypes.EVENT_SAVE_ENROLLMENT_COMPLETE)(
        {},
        {
            offline: {
                effect: {
                    url: 'tracker?async=false&importStrategy=CREATE_AND_UPDATE',
                    method: effectMethods.POST,
                    data: serverData,
                },
                commit: onCompleteEnrollmentSuccessActionType && {
                    type: onCompleteEnrollmentSuccessActionType,
                    meta: { serverData, uid },
                },
                rollback: onCompleteEnrollmentErrorActionType && {
                    type: onCompleteEnrollmentErrorActionType,
                    meta: { serverData, uid },
                },
            },
        },
    );

export const cleanUpEventSaveInProgress = () =>
    actionCreator(newEventWidgetActionTypes.CLEAN_UP_EVENT_SAVE_IN_PROGRESS)();
