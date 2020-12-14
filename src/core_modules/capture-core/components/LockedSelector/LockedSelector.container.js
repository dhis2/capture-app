// @flow
import type { ComponentType } from 'react';
import { connect } from 'react-redux';
import { batchActions } from 'redux-batched-actions';
import { compose } from 'redux';
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
    openSearchPageFromLockedSelector,
    openNewRegistrationPageWithoutProgramIdFromLockedSelector,
    lockedSelectorBatchActionTypes,
} from './LockedSelector.actions';
import { resetProgramIdBase } from './QuickSelector/actions/QuickSelector.actions';
import withLoadingIndicator from '../../HOC/withLoadingIndicator';
import type { Props, DispatchersFromRedux, OwnProps } from './LockedSelector.types';

const mapStateToProps = (state: ReduxState) => ({
    selectedProgramId: state.currentSelections.programId,
    selectedOrgUnitId: state.currentSelections.orgUnitId,
    ready: !state.activePage.isPageLoading,
});

const mapDispatchToProps = (
    dispatch: ReduxDispatch,
    {
        customActionsOnProgramIdReset = [],
        customActionsOnOrgUnitIdReset = [],
    }: OwnProps,
): DispatchersFromRedux => ({
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
    onOpenNewEventPage: () => {
        dispatch(openNewEventPageFromLockedSelector());
    },
    onOpenNewRegistrationPageWithoutProgramId: () => {
        dispatch(openNewRegistrationPageWithoutProgramIdFromLockedSelector());
    },
    onOpenSearchPage: () => {
        dispatch(openSearchPageFromLockedSelector());
    },
    onOpenSearchPageWithoutProgramId: () => {
        dispatch(batchActions([
            resetProgramIdFromLockedSelector(),
            resetAllCategoryOptionsFromLockedSelector(),
            resetProgramIdBase(),
            openSearchPageFromLockedSelector(),
        ], lockedSelectorBatchActionTypes.PROGRAM_ID_RESET_BATCH));
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

export const LockedSelector: ComponentType<OwnProps> =
  compose(
      connect<Props, OwnProps & CssClasses, _, _, _, _>(mapStateToProps, mapDispatchToProps),
      withLoadingIndicator(() => ({ height: '100px' })),
  )(LockedSelectorComponent);

