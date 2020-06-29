// @flow
import { connect } from 'react-redux';
import { batchActions } from 'redux-batched-actions';
import { LockedSelectorComponent } from './LockedSelector.component';
import {
    resetOrgUnitIdFromLockedSelector,
    setOrgUnitFromLockedSelector,
    setProgramIdFromLockedSelector,
    resetProgramIdFromLockedSelector,
    setCategoryOptionFromLockedSelector,
    resetCategoryOptionFromLockedSelector,
    resetAllCategoryOptionsFromLockedSelector,
    openNewEventPageFromLockedSelector,
    lockedSelectorBatchActionTypes,
} from './LockedSelector.actions';
import { resetProgramIdBase } from './QuickSelector/actions/QuickSelector.actions';
import withLoadingIndicator from '../../HOC/withLoadingIndicator';


const mapStateToProps = (state: ReduxState) => ({
    selectedProgramId: state.currentSelections.programId,
    selectedOrgUnitId: state.currentSelections.orgUnitId,
    ready: !state.activePage.isPageLoading,
});

const mapDispatchToProps = (dispatch: ReduxDispatch, { customActionsOnProgramIdReset = [], customActionsOnOrgUnitIdReset = [] }) => ({
    onSetOrgUnit: (id: string, orgUnit: Object) => {
        dispatch(setOrgUnitFromLockedSelector(id, orgUnit));
    },
    onSetProgramId: (id: string) => {
        dispatch(setProgramIdFromLockedSelector(id));
    },
    onSetCategoryOption: (categoryId: string, categoryOption: Object) => {
        dispatch(setCategoryOptionFromLockedSelector(categoryId, categoryOption));
    },
    onResetCategoryOption: (categoryId: string) => {
        dispatch(resetCategoryOptionFromLockedSelector(categoryId));
    },
    onResetAllCategoryOptions: () => {
        dispatch(resetAllCategoryOptionsFromLockedSelector());
    },
    onOpenNewEventPage: (selectedProgramId, selectedOrgUnitId) => {
        dispatch(openNewEventPageFromLockedSelector(selectedProgramId, selectedOrgUnitId));
    },
    onStartAgain: () => {
        dispatch(batchActions([
            resetOrgUnitIdFromLockedSelector(),
            resetProgramIdFromLockedSelector(),
            resetAllCategoryOptionsFromLockedSelector(),
            resetProgramIdBase(),
        ], lockedSelectorBatchActionTypes.AGAIN_START));
    },
    onResetOrgUnitId: () => {
        dispatch(batchActions([
            resetOrgUnitIdFromLockedSelector(),
            ...customActionsOnOrgUnitIdReset,
        ], lockedSelectorBatchActionTypes.ORG_UNIT_ID_RESET_BATCH));
    },
    onResetProgramId: (baseAction: ReduxAction<any, any>) => {
        dispatch(batchActions([
            resetProgramIdFromLockedSelector(),
            resetAllCategoryOptionsFromLockedSelector(),
            baseAction,
            ...customActionsOnProgramIdReset,
        ], lockedSelectorBatchActionTypes.PROGRAM_ID_RESET_BATCH));
    },
});

export const LockedSelector = connect(mapStateToProps, mapDispatchToProps)(withLoadingIndicator()(LockedSelectorComponent));
