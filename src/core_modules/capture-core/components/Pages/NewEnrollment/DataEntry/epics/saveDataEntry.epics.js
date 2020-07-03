// @flow
import { getTrackerProgramThrowIfNotFound } from '../../../../../metaData/helpers';
import { actionTypes, startSaveNewEnrollmentAfterReturnedToMainPage } from '../actions/dataEntry.actions';
import getDataEntryKey from '../../../../DataEntry/common/getDataEntryKey';
import { buildServerDataForEnrollmentDataEntry } from '../../../../DataEntries';

export const saveNewEnrollmentEpic = (action$: InputObservable, store: ReduxStore) =>
   
    // $FlowFixMe[prop-missing] automated comment
    action$.ofType(actionTypes.REQUEST_SAVE_RETURN_TO_MAIN_PAGE)
        .map((action) => {
            const state = store.getState();
            const payload = action.payload;
            const dataEntryKey = getDataEntryKey(payload.dataEntryId, payload.itemId);
            const programId = state.currentSelections.programId;
            const selections = {
                programId,
                orgUnitId: state.currentSelections.orgUnitId,
            };

            const trackerProgram = getTrackerProgramThrowIfNotFound(programId);
            const serverData = buildServerDataForEnrollmentDataEntry(
                dataEntryKey,
                selections,
                trackerProgram.enrollment,
                state.formsValues[dataEntryKey],
                // $FlowFixMe[extra-arg] automated comment
                state.dataEntriesFieldsValue[dataEntryKey],
                state.dataEntriesFieldsMeta[dataEntryKey],
                {},
            );
            return startSaveNewEnrollmentAfterReturnedToMainPage(serverData, state.currentSelections);
        });
