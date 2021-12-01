// @flow
import { useDispatch, useSelector } from 'react-redux';
import React, { type ComponentType, useEffect, useCallback, useState } from 'react';
import type { OwnProps } from './ScopeSelector.types';
import { ScopeSelectorComponent } from './ScopeSelector.component';
import {
    setCategoryOptionFromScopeSelector,
    resetCategoryOptionFromScopeSelector,
    resetAllCategoryOptionsFromScopeSelector,
    resetProgramIdBatchAction,
    resetOrgUnitIdBatchAction,
} from './ScopeSelector.actions';
import { useOrganizationUnit } from './hooks';


const deriveReadiness = (lockedSelectorLoads, selectedOrgUnitId, selectedOrgUnitName) => {
    // because we want the orgUnit to be fetched and stored
    // before allowing the user to view the locked selector
    if (selectedOrgUnitId && selectedOrgUnitName) {
        return true;
    }
    return !lockedSelectorLoads;
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
      const { refetch: refetchOrganisationUnit, displayName } = useOrganizationUnit();
      const [selectedOrgUnit, setSelectedOrgUnit] = useState({ name: displayName, id: selectedOrgUnitId });

      useEffect(() => {
          const missName = !selectedOrgUnit.name;
          const hasDifferentId = selectedOrgUnit.id !== selectedOrgUnitId;

          selectedOrgUnitId && (hasDifferentId || missName) && refetchOrganisationUnit({ variables: { selectedOrgUnitId } });
      },
      [selectedOrgUnitId]); // eslint-disable-line react-hooks/exhaustive-deps

      useEffect(() => {
          displayName && setSelectedOrgUnit(prevSelectedOrgUnit => ({ ...prevSelectedOrgUnit, name: displayName }));
      },
      [displayName, setSelectedOrgUnit]);

      const handleSetOrgUnit = (orgUnitId, orgUnitObject) => {
          setSelectedOrgUnit(orgUnitObject);
          onSetOrgUnit(orgUnitId);
      };

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

      const ready = deriveReadiness(lockedSelectorLoads, selectedOrgUnitId, selectedOrgUnit.name);

      return (
          <ScopeSelectorComponent
              onResetProgramId={dispatchOnResetProgramId}
              onResetOrgUnitId={dispatchOnResetOrgUnitId}
              onResetAllCategoryOptions={dispatchOnResetAllCategoryOptions}
              onResetCategoryOption={dispatchOnResetCategoryOption}
              onSetCategoryOption={dispatchOnSetCategoryOption}
              onSetProgramId={onSetProgramId}
              onSetOrgUnit={handleSetOrgUnit}
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
