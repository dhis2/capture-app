// @flow
import log from 'loglevel';
import errorCreator from '../../../../../utils/errorCreator';
import { actionTypes as urlActionTypes } from '../../actions/url.actions';
import { selectionsNotCompleteOpeningNewEnrollment } from '../actions/openDataEntry.actions';
import { getProgramFromProgramIdThrowIfNotFound, TrackerProgram } from '../../../../../metaData';
import { openDataEntryForNewEnrollmentBatch } from '../actions/openDataEntry.actionBatchs';

const errorMessages = {
    PROGRAM_OR_STAGE_NOT_FOUND: 'Program or stage not found',
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

            return openDataEntryForNewEnrollmentBatch();

            /*
            const programId = state.currentSelections.programId;
            // $FlowSuppress Prechecked
            const program: TrackerProgram = getProgramFromProgramIdThrowIfNotFound(programId);
            const foundation = program.enrollment



            
            const orgUnitId = state.currentSelections.orgUnitId;
            const orgUnit = state.organisationUnits[orgUnitId];
            const metadataContainer = getProgramAndStageFromProgramId(programId);
            if (metadataContainer.error) {
                log.error(
                    errorCreator(
                        errorMessages.PROGRAM_OR_STAGE_NOT_FOUND)(
                        { method: 'openNewEnrollmentInDataEntryEpic' }),
                );
            }
            const foundation = metadataContainer.stage && metadataContainer.stage.stageForm;
            return batchActions(
                // $FlowSuppress
                [...openNewEventInDataEntry(metadataContainer.program, foundation, orgUnit)],
                batchActionTypes.OPEN_NEW_EVENT_IN_DATA_ENTRY_ACTIONS_BATCH,
            );
            */
        });
