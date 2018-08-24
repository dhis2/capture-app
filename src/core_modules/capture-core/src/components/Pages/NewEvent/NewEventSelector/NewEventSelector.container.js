// @flow
import { connect } from 'react-redux';
import { batchActions } from 'redux-batched-actions';
import NewEventSelector from './NewEventSelector.component';
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
} from './NewEventSelector.actions';
import { resetProgramIdBase } from '../../../QuickSelector/actions/QuickSelector.actions';

const newEventDataEntryHasChanges = (state: ReduxState) => {
    const formValues = state.formsValues['singleEvent-newEvent'];
    const formHasChanges = Object
        .keys(formValues)
        .some(key => formValues[key]);

    if (formHasChanges) {
        return true;
    }

    const dataEntryValues = state.dataEntriesFieldsValue['singleEvent-newEvent'];
    const dataEntryHasChanges = Object
        .keys(dataEntryValues)
        .some(key => dataEntryValues[key]);

    return dataEntryHasChanges;
};

const mapStateToProps = (state: ReduxState) => {
    const formInputInProgess = state.currentSelections.complete && newEventDataEntryHasChanges(state);
    return {
        selectionsIsComplete: state.currentSelections.complete,
        formInputInProgess,
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
export default connect(mapStateToProps, mapDispatchToProps)(NewEventSelector);
