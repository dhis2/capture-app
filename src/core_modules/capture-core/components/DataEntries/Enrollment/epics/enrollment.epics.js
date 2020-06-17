// @flow
import log from 'loglevel';
import { ofType } from 'redux-observable';
import { map } from 'rxjs/operators';

import { errorCreator } from 'capture-core-utils';
import { batchActionTypes, runRulesOnUpdateFieldBatch } from '../actions/enrollment.actionBatchs';
import { actionTypes } from '../actions/enrollment.actions';
import { getProgramFromProgramIdThrowIfNotFound, TrackerProgram } from '../../../../metaData';
import { getCurrentClientValues, getCurrentClientMainData } from '../../../../rules/actionsCreator';
import type { FieldData } from '../../../../rules/actionsCreator';
import getDataEntryKey from '../../../DataEntry/common/getDataEntryKey';

const errorMessages = {
    PROGRAM_NOT_FOUND: 'Program not found',
    NOT_TRACKER_PROGRAM: 'Program is not a tracker program',
};

type Context = {
    dataEntryId: string,
    itemId: string,
    uid: string,
    programId: string,
    orgUnit: string,
}

const runRulesOnEnrollmentUpdate =
    (store: ReduxStore, context: Context, fieldData?: ?FieldData, searchActions?: any = []) => {
        const state = store.getState();
        const { programId, dataEntryId, itemId, orgUnit, uid } = context;
        const formId = getDataEntryKey(dataEntryId, itemId);
        let trackerProgram: TrackerProgram;
        try {
            const program = getProgramFromProgramIdThrowIfNotFound(programId);
            if (!(program instanceof TrackerProgram)) {
                log.error(
                    errorCreator(
                        errorMessages.NOT_TRACKER_PROGRAM)(
                        { method: 'openNewEnrollmentInDataEntryEpic', program }),
                );
            } else {
                trackerProgram = program;
            }
        } catch (error) {
            log.error(
                errorCreator(
                    errorMessages.PROGRAM_NOT_FOUND)(
                    { method: 'openNewEnrollmentInDataEntryEpic', error, programId }),
            );
        }

        const foundation = trackerProgram && trackerProgram.enrollment.enrollmentForm;
        if (!trackerProgram || !foundation) {
            return runRulesOnUpdateFieldBatch(
                trackerProgram,
                foundation,
                formId,
                dataEntryId,
                itemId,
                orgUnit,
                null,
                null,
                searchActions,
                uid,
            );
        }

        const currentTEIValues = getCurrentClientValues(state, foundation, formId, fieldData);
        const currentEnrollmentValues =
            getCurrentClientMainData(state, itemId, dataEntryId, {}, foundation);

        return runRulesOnUpdateFieldBatch(
            trackerProgram,
            foundation,
            formId,
            dataEntryId,
            itemId,
            orgUnit,
            currentEnrollmentValues,
            currentTEIValues,
            searchActions,
            uid,
        );
    };


export const runRulesOnEnrollmentDataEntryFieldUpdateEpic = (action$: InputObservable, store: ReduxStore) =>
// $FlowSuppress
    action$.pipe(
        ofType(batchActionTypes.UPDATE_DATA_ENTRY_FIELD_NEW_ENROLLMENT_ACTION_BATCH),
        map(actionBatch =>
            actionBatch.payload.find(action => action.type === actionTypes.START_RUN_RULES_ON_UPDATE)),
        map((action) => {
            const {
                uid,
                programId,
                orgUnit,
                innerPayload,
            } = action.payload;

            const {
                dataEntryId,
                itemId,
            } = innerPayload;

            return runRulesOnEnrollmentUpdate(store, {
                dataEntryId,
                itemId,
                uid,
                programId,
                orgUnit,
            });
        }));

export const runRulesOnEnrollmentFieldUpdateEpic = (action$: InputObservable, store: ReduxStore) =>
    // $FlowSuppress
    action$.pipe(
        ofType(batchActionTypes.UPDATE_FIELD_NEW_ENROLLMENT_ACTION_BATCH),
        map(actionBatch =>
            actionBatch.payload.find(action => action.type === actionTypes.START_RUN_RULES_ON_UPDATE)),
        map((action) => {
            const { innerPayload: payload, searchActions, uid, programId, orgUnit } = action.payload;
            const { dataEntryId, itemId, elementId, value, uiState } = payload;

            const fieldData: FieldData = {
                elementId,
                value,
                valid: uiState.valid,
            };

            return runRulesOnEnrollmentUpdate(store, {
                programId,
                orgUnit,
                dataEntryId,
                itemId,
                uid,
            }, fieldData, searchActions);
        }));
