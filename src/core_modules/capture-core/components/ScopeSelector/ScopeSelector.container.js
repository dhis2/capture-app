// @flow
import React, { type ComponentType, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ScopeSelectorComponent } from './ScopeSelector.component';
import type { OwnProps } from './ScopeSelector.types';
import { useOrganizationUnit } from './hooks';
import { resetOrgUnitIdFromScopeSelector, cancelContextChange, changeContextWhileSaving }
    from './ScopeSelector.actions';

const deriveReadiness = (lockedSelectorLoads, selectedOrgUnitId, selectedOrgUnitName) => {
    // because we want the orgUnit to be fetched and stored
    // before allowing the user to view the locked selector
    if (selectedOrgUnitId && selectedOrgUnitName) {
        return true;
    }
    return !lockedSelectorLoads;
};

export const ScopeSelector: ComponentType<OwnProps> = ({
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

        selectedOrgUnitId &&
            (hasDifferentId || missName) &&
            refetchOrganisationUnit({ variables: { selectedOrgUnitId } });
    }, [selectedOrgUnitId]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        displayName && setSelectedOrgUnit(prevSelectedOrgUnit => ({ ...prevSelectedOrgUnit, name: displayName }));
    }, [displayName, setSelectedOrgUnit]);

    const handleSetOrgUnit = (orgUnitId, orgUnitObject) => {
        setSelectedOrgUnit(orgUnitObject);
        onSetOrgUnit && onSetOrgUnit(orgUnitId);
    };

    const { lockedSelectorLoads, previousOrgUnitId } = useSelector(({ activePage, app }) => (
        {
            lockedSelectorLoads: activePage.lockedSelectorLoads,
            previousOrgUnitId: app.previousOrgUnitId,
        }
    ));
    const ready = deriveReadiness(lockedSelectorLoads, selectedOrgUnitId, selectedOrgUnit.name);
    const isSavingInProgress = useSelector(({ possibleDuplicates }) =>
        possibleDuplicates.isLoading || possibleDuplicates.isUpdating);

    const handleCancelContextChange = () => {
        dispatch(cancelContextChange());
    };
    const handleContextChangeWhileSaving = () => {
        dispatch(changeContextWhileSaving());
    };

    return (
        <ScopeSelectorComponent
            onResetProgramId={onResetProgramId}
            onResetOrgUnitId={() => {
                selectedOrgUnit && dispatch(resetOrgUnitIdFromScopeSelector(selectedOrgUnit?.id));
                return onResetOrgUnitId();
            }}
            onResetAllCategoryOptions={onResetAllCategoryOptions}
            onResetCategoryOption={onResetCategoryOption}
            onSetCategoryOption={onSetCategoryOption}
            onSetProgramId={onSetProgramId}
            onSetOrgUnit={handleSetOrgUnit}
            onCancelContextChange={handleCancelContextChange}
            onContextChangeWhileSaving={handleContextChangeWhileSaving}
            previousOrgUnitId={previousOrgUnitId}
            selectedOrgUnit={selectedOrgUnit}
            selectedOrgUnitId={selectedOrgUnitId}
            selectedProgramId={selectedProgramId}
            selectedCategories={selectedCategories}
            isUserInteractionInProgress={isUserInteractionInProgress}
            isSavingInProgress={isSavingInProgress}
            ready={ready}
        >
            {children}
        </ScopeSelectorComponent>
    );
};
