// @flow
import { actionCreator } from '../../../actions/actions.utils';
import { effectMethods } from '../../../trackerOffline';
import type { RequestEvent } from './validated.types';

export const newEventWidgetActionTypes = {
    RULES_ON_UPDATE_EXECUTE: 'NewEvent.ExecuteRulesOnUpdate',
    EVENT_SAVE_REQUEST: 'NewEvent.RequestSaveEvent',
    EVENT_SAVE_REQUEST_WITH_REFERRAL: 'NewEvent.RequestSaveEventWithReferral',
    REQUEST_SAVE_REFERRAL_IF_EXISTS: 'NewEvent.RequestSaveReferralIfExists',
    EVENT_SAVE: 'NewEvent.SaveEvent',
    EVENT_SAVE_SUCCESS: 'NewEvent.SaveEventSuccess',  // TEMPORARY - pass in success action name to the widget
    EVENT_SAVE_ERROR: 'NewEvent.SaveEventError', // TEMPORARY - pass in error action name to the widget
    EVENT_NOTE_ADD: 'NewEvent.AddEventNote',
    START_CREATE_NEW_AFTER_COMPLETING: 'NewEvent.StartCreateNewAfterCompleting',
};

export const requestSaveEvent = ({
    requestEvent,
    referralEvent,
    relationship,
    onSaveSuccessActionType,
    onSaveErrorActionType,
}: {
    requestEvent: RequestEvent,
    referralEvent?: Object,
    relationship?: Object,
    onSaveSuccessActionType?: string,
    onSaveErrorActionType?: string,
}) =>
    actionCreator(newEventWidgetActionTypes.EVENT_SAVE_REQUEST)({
        requestEvent,
        referralEvent,
        relationship,
        onSaveSuccessActionType,
        onSaveErrorActionType,
    }, { skipLogging: ['formFoundation'] });

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
