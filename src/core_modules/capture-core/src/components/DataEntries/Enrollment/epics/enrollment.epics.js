// @flow
import log from 'loglevel';
import { errorCreator } from 'capture-core-utils';
import { batchActionTypes, runRulesOnUpdateFieldBatch } from '../actions/enrollment.actionBatchs';
import { actionTypes } from '../actions/enrollment.actions';
import { getProgramFromProgramIdThrowIfNotFound, TrackerProgram } from '../../../../metaData';
import { getCurrentClientValues, getCurrentClientMainData } from '../../../../rulesEngineActionsCreator';
import type { FieldData } from '../../../../rulesEngineActionsCreator/inputHelpers';

const errorMessages = {
    PROGRAM_NOT_FOUND: 'Program not found',
    NOT_TRACKER_PROGRAM: 'Program is not a tracker program',
};

export const runRulesOnEnrollmentFieldUpdateEpic = (action$: InputObservable, store: ReduxStore) =>
    // $FlowSuppress
    action$.ofType(batchActionTypes.UPDATE_FIELD_NEW_ENROLLMENT_ACTION_BATCH)
        .map(actionBatch =>
            actionBatch.payload.find(action => action.type === actionTypes.START_RUN_RULES_ON_UPDATE))
        .map((action) => {
            const state = store.getState();
            const { innerPayload: payload, searchActions, uid, programId, orgUnitId } = action.payload;
            const orgUnit = state.organisationUnits[orgUnitId];

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
                    payload.formId,
                    payload.dataEntryId,
                    payload.itemId,
                    orgUnit,
                    null,
                    null,
                    searchActions,
                    uid,
                );
            }

            const fieldData: FieldData = {
                elementId: payload.elementId,
                value: payload.value,
                valid: payload.uiState.valid,
            };

            const currentTEIValues = getCurrentClientValues(state, foundation, payload.formId, fieldData);
            const currentEnrollmentValues =
                getCurrentClientMainData(state, payload.itemId, payload.dataEntryId, {}, foundation);

            return runRulesOnUpdateFieldBatch(
                trackerProgram,
                foundation,
                payload.formId,
                payload.dataEntryId,
                payload.itemId,
                orgUnit,
                currentEnrollmentValues,
                currentTEIValues,
                searchActions,
                uid,
            );
        });
