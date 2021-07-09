// @flow
import React, { type ComponentType, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ScopeSelectorComponent } from './ScopeSelector.component';
import {
    setCategoryOptionFromScopeSelector,
    resetCategoryOptionFromScopeSelector,
    resetAllCategoryOptionsFromScopeSelector,
    openNewRegistrationPageFromScopeSelector,
    openSearchPageFromScopeSelector,
    fetchOrgUnit,
    resetProgramIdBatchAction,
    resetOrgUnitIdBatchAction,
} from './ScopeSelector.actions';
import { resetProgramIdBase } from './QuickSelector/actions/QuickSelector.actions';
import type { OwnProps } from './ScopeSelector.types';
import { useReset, useResetProgramId } from './hooks';


const deriveReadiness = (lockedSelectorLoads, selectedOrgUnitId, organisationUnits) => {
    // because we want the orgUnit to be fetched and stored
    // before allowing the user to view the locked selector
    if (selectedOrgUnitId) {
        const orgUnit = organisationUnits[selectedOrgUnitId];
        return Boolean(orgUnit && orgUnit.id && !lockedSelectorLoads);
    }
    return !lockedSelectorLoads;
};

const useComponentLifecycle = (selectedOrgUnitId) => {
    const dispatch = useDispatch();

    useEffect(() => {
        selectedOrgUnitId && dispatch(fetchOrgUnit(selectedOrgUnitId));
    },
    [dispatch, selectedOrgUnitId]);
};

export const ScopeSelector: ComponentType<OwnProps> =
  ({
      customActionsOnProgramIdReset = [],
      customActionsOnOrgUnitIdReset = [],
      isUserInteractionInProgress = false,
      selectedProgramId,
      selectedOrgUnitId,
      onSetProgramId,
      onSetOrgUnit,
      onResetProgramId,
      onResetOrgUnitId,
      children,
  }) => {
      const dispatch = useDispatch();
      const { reset } = useReset();
      const { resetProgramId } = useResetProgramId();

      const dispatchOnSetCategoryOption = useCallback(
          (categoryId: string, categoryOption: Object) => {
              dispatch(setCategoryOptionFromScopeSelector(categoryId, categoryOption));
          },
          [dispatch]);

      const dispatchOnResetCategoryOption = useCallback(
          (categoryId: string) => {
              dispatch(resetCategoryOptionFromScopeSelector(categoryId));
          },
          [dispatch]);

      const dispatchOnResetAllCategoryOptions = useCallback(
          () => {
              dispatch(resetAllCategoryOptionsFromScopeSelector());
          },
          [dispatch]);

      const dispatchOnOpenNewEventPage = useCallback(
          () => {
              dispatch(openNewRegistrationPageFromScopeSelector());
          },
          [dispatch]);

      const dispatchOnOpenNewRegistrationPageWithoutProgramId = useCallback(
          () => {
              const actions = [
                  resetProgramIdBase(),
                  openNewRegistrationPageFromScopeSelector(),
              ];
              dispatch(resetProgramIdBatchAction(actions));
              resetProgramId('new');
          },
          [dispatch, resetProgramId]);

      const dispatchOnOpenSearchPage = useCallback(
          () => {
              dispatch(openSearchPageFromScopeSelector());
          },
          [dispatch]);

      const dispatchOnOpenSearchPageWithoutProgramId = useCallback(
          () => {
              const actions = [
                  resetProgramIdBase(),
                  openSearchPageFromScopeSelector(),
                  ...customActionsOnProgramIdReset,
              ];
              dispatch(resetProgramIdBatchAction(actions));
              resetProgramId('search');
          },
          [customActionsOnProgramIdReset, dispatch, resetProgramId]);

      const dispatchOnStartAgain = useCallback(
          () => {
              dispatch(resetAllCategoryOptionsFromScopeSelector());
              reset();
          }, [dispatch, reset]);

      const dispatchOnResetOrgUnitId = useCallback(
          () => {
              dispatch(resetOrgUnitIdBatchAction(customActionsOnOrgUnitIdReset));
              onResetOrgUnitId();
          },
          [customActionsOnOrgUnitIdReset, dispatch, onResetOrgUnitId]);

      const dispatchOnResetProgramId = useCallback(
          (baseAction: ReduxAction<any, any>) => {
              const actions = [
                  baseAction,
                  ...customActionsOnProgramIdReset,
              ];

              dispatch(resetProgramIdBatchAction(actions));
              onResetProgramId();
          },
          [customActionsOnProgramIdReset, dispatch, onResetProgramId]);

      const lockedSelectorLoads: string =
        useSelector(({ activePage }) => activePage.lockedSelectorLoads);

      const organisationUnits: Object =
        useSelector(({ organisationUnits: orgUnits }) => orgUnits);
      const selectedOrgUnit = useSelector(({ organisationUnits: orgUnits }) => orgUnits[selectedOrgUnitId] || {});

      const ready = deriveReadiness(lockedSelectorLoads, selectedOrgUnitId, organisationUnits);

      useComponentLifecycle(selectedOrgUnitId);

      return (
          <ScopeSelectorComponent
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
              onSetProgramId={onSetProgramId}
              onSetOrgUnit={onSetOrgUnit}
              selectedOrgUnit={selectedOrgUnit}
              selectedOrgUnitId={selectedOrgUnitId}
              selectedProgramId={selectedProgramId}
              isUserInteractionInProgress={isUserInteractionInProgress}
              ready={ready}
          >
              {children}
          </ScopeSelectorComponent>
      );
  };
