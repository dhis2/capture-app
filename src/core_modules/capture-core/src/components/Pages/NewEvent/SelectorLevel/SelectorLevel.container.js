// @flow
import { connect } from 'react-redux';
import { batchActions } from 'redux-batched-actions';
import SelectorLevel from './SelectorLevel.component';
import {
    resetOrgUnitIdFromNewEventPage,
    setOrgUnitFromNewEventPage,
    setProgramIdFromNewEventPage,
    resetProgramIdFromNewEventPage,
    setCategoryOptionFromNewEventPage,
    resetCategoryOptionFromNewEventPage,
    resetAllCategoryOptionsFromNewEventPage,
    batchActionTypes,
    resetDataEntry,
} from './selectorLevel.actions';
import { resetProgramIdBase } from '../../../QuickSelector/actions/QuickSelector.actions';
import dataEntryHasChanges from '../../../DataEntry/common/dataEntryHasChanges';

const mapStateToProps = (state: ReduxState) => {
    const formInputInProgess = state.currentSelections.complete && dataEntryHasChanges(state, 'singleEvent-newEvent');
    const inAddRelationship = state.newEventPage.showAddRelationship;
    return {
        formInputInProgess,
        inAddRelationship,
    };
};

const mapDispatchToProps = (dispatch: ReduxDispatch) => ({
    onSetOrgUnit: (id: string, orgUnit: Object) => {
        dispatch(setOrgUnitFromNewEventPage(id, orgUnit));
    },
    onResetOrgUnitId: () => {
        dispatch(resetOrgUnitIdFromNewEventPage());
    },
    onSetProgramId: (id: string) => {
        dispatch(setProgramIdFromNewEventPage(id));
    },
    onSetCategoryOption: (categoryId: string, categoryOptionId: string) => {
        dispatch(setCategoryOptionFromNewEventPage(categoryId, categoryOptionId));
    },
    onResetCategoryOption: (categoryId: string) => {
        dispatch(resetCategoryOptionFromNewEventPage(categoryId));
    },
    onResetAllCategoryOptions: () => {
        dispatch(resetAllCategoryOptionsFromNewEventPage());
    },
    onStartAgain: () => {
        dispatch(batchActions([
            resetOrgUnitIdFromNewEventPage(),
            resetProgramIdFromNewEventPage(),
            resetAllCategoryOptionsFromNewEventPage(),
            resetProgramIdBase(),
        ], batchActionTypes.START_AGAIN));
    },
    onResetProgramId: (baseAction: ReduxAction<any, any>) => {
        dispatch(batchActions([
            resetProgramIdFromNewEventPage(),
            resetAllCategoryOptionsFromNewEventPage(),
            baseAction,
        ], batchActionTypes.RESET_PROGRAM_AND_CATEGORY_OPTION));
    },
    onResetDataEntry: () => {
        dispatch(resetDataEntry());
    },
});

// $FlowSuppress
export default connect(mapStateToProps, mapDispatchToProps)(SelectorLevel);
