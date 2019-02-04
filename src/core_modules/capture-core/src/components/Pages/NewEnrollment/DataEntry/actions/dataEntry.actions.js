// @flow
import { actionCreator } from '../../../../../actions/actions.utils';
import { methods } from '../../../../../trackerOffline/trackerOfflineConfig.const';

export const actionTypes = {
    START_RUN_RULES_ON_UPDATE: 'StartRunRulesOnUpdateForNewEnrollment',
    REQUEST_SAVE_RETURN_TO_MAIN_PAGE: 'RequestSaveAndReturnToMainPageForNewEnrollment',
    START_SAVE_AFTER_RETURNED_TO_MAIN_PAGE: 'StartSaveAfterReturnedToMainPageForNewEnrollment',
    ENROLLMENT_SAVED: 'EnrollmentSaved',
    ENROLLMENT_SAVE_FAILED: 'EnrollmentSaveFailed',
};

export const startRunRulesOnUpdateForNewEnrollment = (actionData: { payload: Object}, searchActions: any) =>
    actionCreator(actionTypes.START_RUN_RULES_ON_UPDATE)({ actionData, searchActions }, { skipLogging: ['searchActions'] });

export const requestSaveNewEnrollmentAndReturnToMainPage =
    (dataEntryId: string, itemId: string, formFoundation: Object) =>
        actionCreator(actionTypes.REQUEST_SAVE_RETURN_TO_MAIN_PAGE)(
            { dataEntryId, itemId, formFoundation }, { skipLogging: ['formFoundation'] },
        );

export const startSaveNewEnrollmentAfterReturnedToMainPage =
    (serverData: Object, selections: Object) =>
        actionCreator(actionTypes.START_SAVE_AFTER_RETURNED_TO_MAIN_PAGE)({ selections }, {
            offline: {
                effect: {
                    url: 'trackedEntityInstances',
                    method: methods.POST,
                    data: serverData,
                },
                commit: { type: actionTypes.ENROLLMENT_SAVED, meta: { selections } },
                rollback: { type: actionTypes.ENROLLMENT_SAVE_FAILED, meta: { selections } },
            },
        });
