// @flow
import { connect } from 'react-redux';
import { batchActions } from 'redux-batched-actions';
import SearchPageSelector from './SearchPageSelector.component';
import {
    resetOrgUnitIdFromSearchPage,
    setOrgUnitFromSearchPage,
    setProgramIdFromSearchPage,
    resetProgramIdFromSearchPage,
    setCategoryOptionFromSearchPage,
    resetCategoryOptionFromSearchPage,
    resetAllCategoryOptionsFromSearchPage,
    openNewEventPageFromSearchPage,
    batchActionTypes,
} from './SearchPageSelector.actions';
import { resetProgramIdBase } from '../../../QuickSelector/actions/QuickSelector.actions';

const mapStateToProps = (state: ReduxState) => ({
    selectedProgramId: state.currentSelections.programId,
    selectedOrgUnitId: state.currentSelections.orgUnitId,
});

const mapDispatchToProps = (dispatch: ReduxDispatch) => ({
    onSetOrgUnit: (id: string, orgUnit: Object) => {
        dispatch(setOrgUnitFromSearchPage(id, orgUnit));
    },
    onResetOrgUnitId: () => {
        dispatch(resetOrgUnitIdFromSearchPage());
    },
    onSetProgramId: (id: string) => {
        dispatch(setProgramIdFromSearchPage(id));
    },
    onSetCategoryOption: (categoryId: string, categoryOption: Object) => {
        dispatch(setCategoryOptionFromSearchPage(categoryId, categoryOption));
    },
    onResetCategoryOption: (categoryId: string) => {
        dispatch(resetCategoryOptionFromSearchPage(categoryId));
    },
    onResetAllCategoryOptions: () => {
        dispatch(resetAllCategoryOptionsFromSearchPage());
    },
    onOpenNewEventPage: (programId: string, orgUnitId: string) => {
        dispatch(openNewEventPageFromSearchPage(programId, orgUnitId));
    },
    onStartAgain: () => {
        dispatch(batchActions([
            resetOrgUnitIdFromSearchPage(),
            resetProgramIdFromSearchPage(),
            resetAllCategoryOptionsFromSearchPage(),
            resetProgramIdBase(),
        ], batchActionTypes.START_AGAIN));
    },
    onResetProgramId: (baseAction: ReduxAction<any, any>) => {
        dispatch(batchActions([
            resetProgramIdFromSearchPage(),
            resetAllCategoryOptionsFromSearchPage(),
            baseAction,
        ], batchActionTypes.RESET_PROGRAM_AND_CATEGORY_OPTION));
    },
});

// $FlowSuppress
export default connect(mapStateToProps, mapDispatchToProps)(SearchPageSelector);
