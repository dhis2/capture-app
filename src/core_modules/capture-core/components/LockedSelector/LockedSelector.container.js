// @flow
import React, { type ComponentType, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import type { OrgUnit } from 'capture-core-utils/rulesEngine';
import { LockedSelectorComponent } from './LockedSelector.component';
import {
    setOrgUnitFromLockedSelector,
    setProgramIdFromLockedSelector,
    setCategoryOptionFromLockedSelector,
    resetCategoryOptionFromLockedSelector,
    resetAllCategoryOptionsFromLockedSelector,
    openNewRegistrationPageFromLockedSelector,
    openSearchPageFromLockedSelector,
    setCurrentOrgUnitBasedOnUrl,
    resetProgramIdBatchAction,
    startAgainBatchAction,
    resetOrgUnitIdBatchAction,
} from './LockedSelector.actions';
import { resetProgramIdBase } from './QuickSelector/actions/QuickSelector.actions';
import type { OwnProps } from './LockedSelector.types';
import { pageFetchesOrgUnitUsingTheOldWay } from '../../utils/url';
import { useLocationQuery } from '../../utils/routing';
import { useRulesEngineOrgUnit } from '../../hooks/useRulesEngineOrgUnit';

const deriveReadiness = (lockedSelectorLoads, selectedOrgUnitId, orgUnit, organisationUnits) => {
    // because we want the orgUnit to be fetched and stored
    // before allowing the user to view the locked selector
    if (selectedOrgUnitId) {
        const selectedOrgUnit = organisationUnits[selectedOrgUnitId];
        return Boolean(orgUnit && selectedOrgUnit && selectedOrgUnit.id && !lockedSelectorLoads);
    }
    return !lockedSelectorLoads;
};

const useComponentLifecycle = (orgUnit: ?OrgUnit) => {
    const dispatch = useDispatch();
    const { pathname } = useLocation();
    const pageFetchesOrgUnit = !pageFetchesOrgUnitUsingTheOldWay(pathname.substring(1));

    useEffect(() => {
        pageFetchesOrgUnit && orgUnit && dispatch(setCurrentOrgUnitBasedOnUrl({ id: orgUnit.id, name: orgUnit.name }));
    },
    [dispatch, orgUnit, pageFetchesOrgUnit]);
};

export const LockedSelector: ComponentType<OwnProps> =
  ({
      customActionsOnProgramIdReset = [],
      customActionsOnOrgUnitIdReset = [],
      pageToPush = '',
      isUserInteractionInProgress = false,
  }) => {
      const dispatch = useDispatch();

      const { orgUnitId: urlOrgUnit, programId: urlProgramId } = useLocationQuery();
      const { orgUnitId, programId } = useSelector(({ currentSelections }) => ({
          orgUnitId: urlOrgUnit || currentSelections.orgUnitId,
          programId: urlProgramId || currentSelections.programId,
      }));

      const { orgUnit, error } = useRulesEngineOrgUnit(orgUnitId);

      const lockedSelectorLoads: string =
        useSelector(({ activePage }) => activePage.lockedSelectorLoads);

      const dispatchOnSetOrgUnit = useCallback(
          (id: string, newOrgUnit: Object) => {
              dispatch(setOrgUnitFromLockedSelector(id, newOrgUnit, pageToPush));
          },
          [pageToPush, dispatch]);

      const dispatchOnSetProgramId = useCallback(
          (id: string) => {
              dispatch(setProgramIdFromLockedSelector(id, pageToPush));
          },
          [pageToPush, dispatch]);

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
              const actions = [
                  resetProgramIdBase(),
                  openNewRegistrationPageFromLockedSelector(),
              ];
              dispatch(resetProgramIdBatchAction(actions, 'new'));
          },
          [dispatch]);

      const dispatchOnOpenSearchPage = useCallback(
          () => {
              dispatch(openSearchPageFromLockedSelector());
          },
          [dispatch]);

      const dispatchOnOpenSearchPageWithoutProgramId = useCallback(
          () => {
              const actions = [
                  resetProgramIdBase(),
                  openSearchPageFromLockedSelector(),
                  ...customActionsOnProgramIdReset,
              ];
              dispatch(resetProgramIdBatchAction(actions, 'search'));
          },
          [customActionsOnProgramIdReset, dispatch]);

      const dispatchOnStartAgain = useCallback(
          () => {
              dispatch(startAgainBatchAction());
          }, [dispatch]);

      const dispatchOnResetOrgUnitId = useCallback(
          () => {
              dispatch(resetOrgUnitIdBatchAction(customActionsOnOrgUnitIdReset, pageToPush));
          },
          [pageToPush, customActionsOnOrgUnitIdReset, dispatch]);

      const dispatchOnResetProgramId = useCallback(
          (baseAction: ReduxAction<any, any>) => {
              const actions = [
                  baseAction,
                  ...customActionsOnProgramIdReset,
              ];

              dispatch(resetProgramIdBatchAction(actions, pageToPush));
          },
          [pageToPush, customActionsOnProgramIdReset, dispatch]);

      const organisationUnits: Object =
        useSelector(({ organisationUnits: orgUnits }) => orgUnits);

      const ready = deriveReadiness(lockedSelectorLoads, orgUnitId, orgUnit, organisationUnits);

      useComponentLifecycle(orgUnit);

      if (error) {
          return error.errorComponent;
      }

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
              selectedOrgUnitId={orgUnitId}
              selectedProgramId={programId}
              isUserInteractionInProgress={isUserInteractionInProgress}
              ready={ready}
          />
      );
  };
