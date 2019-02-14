// @flow
import log from 'loglevel';
import errorCreator from '../../../../../utils/errorCreator';
import { actionTypes as urlActionTypes } from '../../actions/url.actions';
import { batchActionTypes } from '../actions/dataEntry.actionBatchs';
import { actionTypes } from '../actions/dataEntry.actions';
import {
    openDataEntryForNewEnrollment,
    selectionsNotCompleteOpeningNewEnrollment,
} from '../actions/openDataEntry.actions';
import { getProgramFromProgramIdThrowIfNotFound, TrackerProgram } from '../../../../../metaData';
import {
    openDataEntryForNewEnrollmentBatch,
    runRulesOnUpdateFieldBatch,
} from '../../../../DataEntries';
import { getCurrentClientValues, getCurrentClientMainData } from '../../../../../rulesEngineActionsCreator';
import type { FieldData } from '../../../../../rulesEngineActionsCreator/inputHelpers';

const errorMessages = {
    PROGRAM_NOT_FOUND: 'Program not found',
    NOT_TRACKER_PROGRAM: 'Program is not a tracker program',
};

export const openNewEnrollmentInDataEntryEpic = (action$: InputObservable, store: ReduxStore) =>
    // $FlowSuppress
    action$.ofType(
        urlActionTypes.VALID_SELECTIONS_FROM_URL,
    )
        .map(() => {
            const state = store.getState();
            const selectionsComplete = state.currentSelections.complete;
            if (!selectionsComplete) {
                return selectionsNotCompleteOpeningNewEnrollment();
            }

            const programId = state.currentSelections.programId;
            const orgUnitId = state.currentSelections.orgUnitId;
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
            return openDataEntryForNewEnrollmentBatch(
                trackerProgram,
                foundation,
                orgUnit,
                'enrollment',
                [openDataEntryForNewEnrollment()],
            );
        });

export const runRulesOnNewEnrollmentFieldUpdateEpic = (action$: InputObservable, store: ReduxStore) =>
    // $FlowSuppress
    action$.ofType(batchActionTypes.UPDATE_FIELD_NEW_ENROLLMENT_ACTION_BATCH)
        .map(actionBatch =>
            actionBatch.payload.find(action => action.type === actionTypes.START_RUN_RULES_ON_UPDATE))
        .map((action) => {
            const state = store.getState();
            const { innerPayload: payload, searchActions, uid } = action.payload;

            const programId = state.currentSelections.programId;
            const orgUnitId = state.currentSelections.orgUnitId;
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
