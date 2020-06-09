// @flow
import { connect } from 'react-redux';
import { batchActions } from 'redux-batched-actions';
import SearchPageSelector from './component';
import {
    resetOrgUnitIdFromSearchPage,
    setOrgUnitFromSearchPage,
    setProgramIdFromSearchPage,
    resetProgramIdFromSearchPage,
    setCategoryOptionFromSearchPage,
    resetCategoryOptionFromSearchPage,
    resetAllCategoryOptionsFromSearchPage,
    openNewEventPage,
    lockedSelectorBatchActionTypes,
} from './actions';
import { resetProgramIdBase } from './QuickSelector/actions/QuickSelector.actions';
import withLoadingIndicator from '../../HOC/withLoadingIndicator';


const mapStateToProps = (state: ReduxState) => ({
    selectedProgramId: state.currentSelections.programId,
    selectedOrgUnitId: state.currentSelections.orgUnitId,
    ready: !state.activePage.isLoading,
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
    onOpenNewEventPage: (selectedProgramId, selectedOrgUnitId) => {
        dispatch(openNewEventPage(selectedProgramId, selectedOrgUnitId));
    },
    onStartAgain: () => {
        dispatch(batchActions([
            resetOrgUnitIdFromSearchPage(),
            resetProgramIdFromSearchPage(),
            resetAllCategoryOptionsFromSearchPage(),
            resetProgramIdBase(),
        ], lockedSelectorBatchActionTypes.START_AGAIN));
    },
    onResetProgramId: (baseAction: ReduxAction<any, any>) => {
        dispatch(batchActions([
            resetProgramIdFromSearchPage(),
            resetAllCategoryOptionsFromSearchPage(),
            baseAction,
        ], lockedSelectorBatchActionTypes.RESET_PROGRAM_AND_CATEGORY_OPTION));
    },
});

export const LockedSelector = connect(mapStateToProps, mapDispatchToProps)(withLoadingIndicator()(SearchPageSelector));
