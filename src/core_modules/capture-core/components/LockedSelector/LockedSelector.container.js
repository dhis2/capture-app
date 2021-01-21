// @flow
import React, { type ComponentType, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
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
    openNewRegistrationPageFromLockedSelector,
    openSearchPageFromLockedSelector,
    lockedSelectorBatchActionTypes,
} from './LockedSelector.actions';
import { resetProgramIdBase } from './QuickSelector/actions/QuickSelector.actions';
import type { OwnProps } from './LockedSelector.types';

const deriveReadiness = (isPageLoading, selectedOrgUnitId, organisationUnits) => {
    // because we want the orgUnit to be fetched and stored
    // before allowing the user to view the locked selector
    if (selectedOrgUnitId) {
        const orgUnit = organisationUnits[selectedOrgUnitId];
        return Boolean(orgUnit && orgUnit.id && !isPageLoading);
    }
    return !isPageLoading;
};

const useUrlQueries = (): { selectedProgramId: string, selectedOrgUnitId: string, pathname: string } =>
    useSelector(({
        currentSelections: {
            programId: selectedProgramId,
            orgUnitId: selectedOrgUnitId,
        },
        router: {
            location: {
                query: {
                    programId: routerProgramId,
                    orgUnitId: routerOrgUnitId,
                },
                pathname,
            },
        },
    }) =>
        ({
            selectedProgramId: routerProgramId || selectedProgramId,
            selectedOrgUnitId: routerOrgUnitId || selectedOrgUnitId,
            pathname,
        }),
    );

export const LockedSelector: ComponentType<OwnProps> =
  ({
      customActionsOnProgramIdReset = [],
      customActionsOnOrgUnitIdReset = [],
  }) => {
      const dispatch = useDispatch();

      const dispatchOnSetOrgUnit = useCallback(
          (id: string, orgUnit: Object) => {
              dispatch(setOrgUnitFromLockedSelector(id, orgUnit));
          },
          [dispatch]);

      const dispatchOnSetProgramId = useCallback(
          (id: string) => {
              dispatch(setProgramIdFromLockedSelector(id));
          },
          [dispatch]);

      const dispatchOnSetCategoryOption = useCallback(
          (categoryId: string, categoryOption: Object) => {
              dispatch(setCategoryOptionFromLockedSelector(categoryId, categoryOption));
          },
          [dispatch]);

      const dispatchOnResetCategoryOption = useCallback(
          (categoryId: string) => {
              dispatch(resetCategoryOptionFromLockedSelector(categoryId));
          },
          [dispatch]);

      const dispatchOnResetAllCategoryOptions = useCallback(
          () => {
              dispatch(resetAllCategoryOptionsFromLockedSelector());
          },
          [dispatch]);

      const dispatchOnOpenNewEventPage = useCallback(
          () => {
              dispatch(openNewRegistrationPageFromLockedSelector());
          },
          [dispatch]);

      const dispatchOnOpenNewRegistrationPageWithoutProgramId = useCallback(
          () => {
              // todo this is problematic here
              dispatch(batchActions([
                  resetProgramIdFromLockedSelector(),
                  resetAllCategoryOptionsFromLockedSelector(),
                  resetProgramIdBase(),
                  openNewRegistrationPageFromLockedSelector(),
              ], lockedSelectorBatchActionTypes.PROGRAM_ID_RESET_BATCH));
          },
          [dispatch]);

      const dispatchOnOpenSearchPage = useCallback(
          () => {
              dispatch(openSearchPageFromLockedSelector());
          },
          [dispatch]);

      const dispatchOnOpenSearchPageWithoutProgramId = useCallback(
          () => {
              // todo this is problematic here
              dispatch(batchActions([
                  resetProgramIdFromLockedSelector(),
                  resetAllCategoryOptionsFromLockedSelector(),
                  resetProgramIdBase(),
                  openSearchPageFromLockedSelector(),
              ], lockedSelectorBatchActionTypes.PROGRAM_ID_RESET_BATCH));
          },
          [dispatch]);

      const dispatchOnStartAgain = useCallback(
          () => {
              dispatch(batchActions([
                  resetOrgUnitIdFromLockedSelector(),
                  resetProgramIdFromLockedSelector(),
                  resetAllCategoryOptionsFromLockedSelector(),
                  resetProgramIdBase(),
              ], lockedSelectorBatchActionTypes.AGAIN_START));
          },
          [dispatch]);

      const dispatchOnResetOrgUnitId = useCallback(
          () => {
              dispatch(batchActions([
                  resetOrgUnitIdFromLockedSelector(),
                  ...customActionsOnOrgUnitIdReset,
              ], lockedSelectorBatchActionTypes.ORG_UNIT_ID_RESET_BATCH));
          },
          [customActionsOnOrgUnitIdReset, dispatch]);

      const dispatchOnResetProgramId = useCallback(
          (baseAction: ReduxAction<any, any>) => {
              dispatch(batchActions([
                  resetProgramIdFromLockedSelector(),
                  resetAllCategoryOptionsFromLockedSelector(),
                  baseAction,
                  ...customActionsOnProgramIdReset,
              ], lockedSelectorBatchActionTypes.PROGRAM_ID_RESET_BATCH));
          },
          [customActionsOnProgramIdReset, dispatch]);

      const { selectedOrgUnitId, selectedProgramId } = useUrlQueries();

      const isPageLoading: string =
        useSelector(({ activePage }) => activePage.isPageLoading);


      const organisationUnits: Object =
        useSelector(({ organisationUnits: orgUnits }) => orgUnits);

      const ready = deriveReadiness(isPageLoading, selectedOrgUnitId, organisationUnits);

      return (
          <LockedSelectorComponent
              onStartAgain={dispatchOnStartAgain}
              onOpenSearchPageWithoutProgramId={dispatchOnOpenSearchPageWithoutProgramId}
              onOpenSearchPage={dispatchOnOpenSearchPage}
              onOpenNewRegistrationPageWithoutProgramId={dispatchOnOpenNewRegistrationPageWithoutProgramId}
              onOpenNewEventPage={dispatchOnOpenNewEventPage}
              onResetProgramId={dispatchOnResetProgramId}
              onResetOrgUnitId={dispatchOnResetOrgUnitId}
              onResetAllCategoryOptions={dispatchOnResetAllCategoryOptions}
              onResetCategoryOption={dispatchOnResetCategoryOption}
              onSetCategoryOption={dispatchOnSetCategoryOption}
              onSetProgramId={dispatchOnSetProgramId}
              onSetOrgUnit={dispatchOnSetOrgUnit}
              selectedOrgUnitId={selectedOrgUnitId}
              selectedProgramId={selectedProgramId}
              ready={ready}
          />
      );
  };
