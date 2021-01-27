// @flow
import React, { type ComponentType, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router';
import { LockedSelectorComponent } from './LockedSelector.component';
import {
    setOrgUnitFromLockedSelector,
    setProgramIdFromLockedSelector,
    setCategoryOptionFromLockedSelector,
    resetCategoryOptionFromLockedSelector,
    resetAllCategoryOptionsFromLockedSelector,
    openNewRegistrationPageFromLockedSelector,
    openSearchPageFromLockedSelector,
    fetchOrgUnit,
    resetProgramIdBatchAction,
    startAgainBatchAction,
    resetOrgUnitIdBatchAction,
} from './LockedSelector.actions';
import { resetProgramIdBase } from './QuickSelector/actions/QuickSelector.actions';
import type { OwnProps } from './LockedSelector.types';
import { pageFetchesOrgUnitUsingTheOldWay } from '../../utils/url';

const deriveReadiness = (lockedSelectorLoads, selectedOrgUnitId, organisationUnits) => {
    // because we want the orgUnit to be fetched and stored
    // before allowing the user to view the locked selector
    if (selectedOrgUnitId) {
        const orgUnit = organisationUnits[selectedOrgUnitId];
        return Boolean(orgUnit && orgUnit.id && !lockedSelectorLoads);
    }
    return !lockedSelectorLoads;
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

const useComponentLifecycle = () => {
    const dispatch = useDispatch();
    const { selectedOrgUnitId } = useUrlQueries();
    const { pathname } = useLocation();
    const pageFetchesOrgUnit = !pageFetchesOrgUnitUsingTheOldWay(pathname.substring(1));

    useEffect(() => {
        pageFetchesOrgUnit && selectedOrgUnitId && dispatch(fetchOrgUnit(selectedOrgUnitId));
    },
    [dispatch, selectedOrgUnitId, pageFetchesOrgUnit]);
};

export const LockedSelector: ComponentType<OwnProps> =
  ({
      customActionsOnProgramIdReset = [],
      customActionsOnOrgUnitIdReset = [],
      pageToPush = '',
  }) => {
      const dispatch = useDispatch();

      const dispatchOnSetOrgUnit = useCallback(
          (id: string, orgUnit: Object) => {
              dispatch(setOrgUnitFromLockedSelector(id, orgUnit, pageToPush));
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

      const { selectedOrgUnitId, selectedProgramId } = useUrlQueries();

      const lockedSelectorLoads: string =
        useSelector(({ activePage }) => activePage.lockedSelectorLoads);


      const organisationUnits: Object =
        useSelector(({ organisationUnits: orgUnits }) => orgUnits);

      const ready = deriveReadiness(lockedSelectorLoads, selectedOrgUnitId, organisationUnits);

      useComponentLifecycle();

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
