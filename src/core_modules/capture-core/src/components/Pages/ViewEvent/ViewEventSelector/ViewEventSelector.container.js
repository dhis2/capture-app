// @flow
import { connect } from 'react-redux';
import { batchActions } from 'redux-batched-actions';
import ViewEventSelector from './ViewEventSelector.component';
import {
    resetOrgUnitIdFromViewEventPage,
    setOrgUnitFromViewEventPage,
    setProgramIdFromViewEventPage,
    resetProgramIdFromViewEventPage,
    setCategoryOptionFromViewEventPage,
    resetCategoryOptionFromViewEventPage,
    resetAllCategoryOptionsFromViewEventPage,
    openNewEventPageFromViewEventPage,
    batchActionTypes,
} from './ViewEventSelector.actions';
import { resetProgramIdBase } from '../../../QuickSelector/actions/QuickSelector.actions';
import dataEntryHasChanges from '../../../DataEntry/common/dataEntryHasChanges';


const mapStateToProps = (state: ReduxState) => ({
    selectedProgramId: state.currentSelections.programId,
    selectedOrgUnitId: state.currentSelections.orgUnitId,
    formInputInProgress: state.currentSelections.complete && dataEntryHasChanges(state, 'singleEvent-viewEvent'),
    showAddRelationship: state.viewEventPage.showAddRelationship,
});

const mapDispatchToProps = (dispatch: ReduxDispatch) => ({
    onSetOrgUnit: (id: string, orgUnit: Object) => {
        dispatch(setOrgUnitFromViewEventPage(id, orgUnit));
    },
    onResetOrgUnitId: () => {
        dispatch(resetOrgUnitIdFromViewEventPage());
    },
    onSetProgramId: (id: string) => {
        dispatch(setProgramIdFromViewEventPage(id));
    },
    onSetCategoryOption: (categoryId: string, categoryOptionId: string) => {
        dispatch(setCategoryOptionFromViewEventPage(categoryId, categoryOptionId));
    },
    onResetCategoryOption: (categoryId: string) => {
        dispatch(resetCategoryOptionFromViewEventPage(categoryId));
    },
    onResetAllCategoryOptions: () => {
        dispatch(resetAllCategoryOptionsFromViewEventPage());
    },
    onOpenNewEventPage: (programId: string, orgUnitId: string) => {
        dispatch(openNewEventPageFromViewEventPage(programId, orgUnitId));
    },
    onStartAgain: () => {
        dispatch(batchActions([
            resetOrgUnitIdFromViewEventPage(),
            resetProgramIdFromViewEventPage(),
            resetAllCategoryOptionsFromViewEventPage(),
            resetProgramIdBase(),
        ], batchActionTypes.START_AGAIN));
    },
    onResetProgramId: (baseAction: ReduxAction<any, any>) => {
        dispatch(batchActions([
            resetProgramIdFromViewEventPage(),
            resetAllCategoryOptionsFromViewEventPage(),
            baseAction,
        ], batchActionTypes.RESET_PROGRAM_AND_CATEGORY_OPTION));
    },
});

// $FlowSuppress
export default connect(mapStateToProps, mapDispatchToProps)(ViewEventSelector);
