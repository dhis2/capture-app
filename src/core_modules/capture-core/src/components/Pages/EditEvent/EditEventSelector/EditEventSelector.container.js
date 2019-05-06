// @flow
import { connect } from 'react-redux';
import { batchActions } from 'redux-batched-actions';
import EditEventSelector from './EditEventSelector.component';
import {
    resetOrgUnitIdFromEditEventPage,
    setOrgUnitFromEditEventPage,
    setProgramIdFromEditEventPage,
    resetProgramIdFromEditEventPage,
    setCategoryOptionFromEditEventPage,
    resetCategoryOptionFromEditEventPage,
    resetAllCategoryOptionsFromEditEventPage,
    openNewEventPageFromEditEventPage,
    batchActionTypes,
} from './EditEventSelector.actions';
import { resetProgramIdBase } from '../../../QuickSelector/actions/QuickSelector.actions';
import dataEntryHasChanges from '../../../DataEntry/common/dataEntryHasChanges';


const mapStateToProps = (state: ReduxState) => ({
    selectedProgramId: state.currentSelections.programId,
    selectedOrgUnitId: state.currentSelections.orgUnitId,
    formInputInProgress: state.currentSelections.complete && dataEntryHasChanges(state, 'singleEvent-editEvent'),
});

const mapDispatchToProps = (dispatch: ReduxDispatch) => ({
    onSetOrgUnit: (id: string, orgUnit: Object) => {
        dispatch(setOrgUnitFromEditEventPage(id, orgUnit));
    },
    onResetOrgUnitId: () => {
        dispatch(resetOrgUnitIdFromEditEventPage());
    },
    onSetProgramId: (id: string) => {
        dispatch(setProgramIdFromEditEventPage(id));
    },
    onSetCategoryOption: (categoryId: string, categoryOptionId: string) => {
        dispatch(setCategoryOptionFromEditEventPage(categoryId, categoryOptionId));
    },
    onResetCategoryOption: (categoryId: string) => {
        dispatch(resetCategoryOptionFromEditEventPage(categoryId));
    },
    onResetAllCategoryOptions: () => {
        dispatch(resetAllCategoryOptionsFromEditEventPage());
    },
    onOpenNewEventPage: (programId: string, orgUnitId: string) => {
        dispatch(openNewEventPageFromEditEventPage(programId, orgUnitId));
    },
    onStartAgain: () => {
        dispatch(batchActions([
            resetOrgUnitIdFromEditEventPage(),
            resetProgramIdFromEditEventPage(),
            resetAllCategoryOptionsFromEditEventPage(),
            resetProgramIdBase(),
        ], batchActionTypes.START_AGAIN));
    },
    onResetProgramId: (baseAction: ReduxAction<any, any>) => {
        dispatch(batchActions([
            resetProgramIdFromEditEventPage(),
            resetAllCategoryOptionsFromEditEventPage(),
            baseAction,
        ], batchActionTypes.RESET_PROGRAM_AND_CATEGORY_OPTION));
    },
});

// $FlowSuppress
export default connect(mapStateToProps, mapDispatchToProps)(EditEventSelector);
