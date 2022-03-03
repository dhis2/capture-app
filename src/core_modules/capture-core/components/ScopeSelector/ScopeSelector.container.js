// @flow
import React, { type ComponentType, useEffect, useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ScopeSelectorComponent } from './ScopeSelector.component';
import {
    resetProgramIdBatchAction,
    resetOrgUnitIdBatchAction,
} from './ScopeSelector.actions';
import type { OwnProps } from './ScopeSelector.types';
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
      selectedCategories,
      onSetProgramId,
      onSetOrgUnit,
      onSetCategoryOption,
      onResetProgramId,
      onResetOrgUnitId,
      onResetCategoryOption,
      onResetAllCategoryOptions,
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
              onResetAllCategoryOptions={onResetAllCategoryOptions}
              onResetCategoryOption={onResetCategoryOption}
              onSetCategoryOption={onSetCategoryOption}
              onSetProgramId={onSetProgramId}
              onSetOrgUnit={handleSetOrgUnit}
              selectedOrgUnit={selectedOrgUnit}
              selectedOrgUnitId={selectedOrgUnitId}
              selectedProgramId={selectedProgramId}
              selectedCategories={selectedCategories}
              isUserInteractionInProgress={isUserInteractionInProgress}
              ready={ready}
          >
              {children}
          </ScopeSelectorComponent>
      );
  };
