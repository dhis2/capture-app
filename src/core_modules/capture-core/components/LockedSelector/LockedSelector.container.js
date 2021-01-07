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
    lockedSelectorBatchActionTypes,
} from './LockedSelector.actions';
import { resetProgramIdBase } from './QuickSelector/actions/QuickSelector.actions';
import withLoadingIndicator from '../../HOC/withLoadingIndicator';
import type { Props, DispatchersFromRedux, OwnProps } from './LockedSelector.types';

const deriveReadiness = (lockedSelectorLoads, selectedOrgUnitId, organisationUnits) => {
    // because we want the orgUnit to be fetched and stored
    // before allow the user to view the locked selector
    if (selectedOrgUnitId) {
        const orgUnit = organisationUnits[selectedOrgUnitId];
        return Boolean(orgUnit && orgUnit.id && !lockedSelectorLoads);
    }
    return !lockedSelectorLoads;
};
const mapStateToProps = ({
    activePage: { lockedSelectorLoads },
    currentSelections: { programId, orgUnitId }, organisationUnits,
}: ReduxState) => ({
    selectedProgramId: programId,
    selectedOrgUnitId: orgUnitId,
    ready: deriveReadiness(lockedSelectorLoads, orgUnitId, organisationUnits),
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
    onOpenNewEventPage: (selectedProgramId, selectedOrgUnitId) => {
        dispatch(openNewEventPageFromLockedSelector(selectedProgramId, selectedOrgUnitId));
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

