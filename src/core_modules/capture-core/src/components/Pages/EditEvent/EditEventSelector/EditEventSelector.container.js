// @flow
import { connect } from 'react-redux';
import programCollection from '../../../../metaDataMemoryStores/programCollection/programCollection';
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

const editEventDataEntryHasChanges = (state: ReduxState) => {
    const program = programCollection.get(state.currentSelections.programId);
    if (!program) {
        return false;
    }

    const key = 'singleEvent-editEvent';
    // $FlowSuppress
    const formIsModified = Array.from(program.getStage().sections.values())
        .some((section) => {
            const sectionId = section.id;
            const sectionKey = `${key}-${sectionId}`;
            const sectionData = state.formsSectionsFieldsUI[sectionKey];
            return Object
                .keys(sectionData)
                .some(elementKey => sectionData[elementKey].modified);
        });

    if (formIsModified) {
        return true;
    }

    const UIDataForDataValues = state.dataEntriesFieldsUI[key];
    const dataEntryIsModified = Object
        .keys(UIDataForDataValues)
        .some(elementKey => UIDataForDataValues[elementKey].modified);

    return dataEntryIsModified;
};

const mapStateToProps = (state: ReduxState) => ({
    selectedProgramId: state.currentSelections.programId,
    selectedOrgUnitId: state.currentSelections.orgUnitId,
    formInputInProgress: state.currentSelections.complete && editEventDataEntryHasChanges(state),
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
