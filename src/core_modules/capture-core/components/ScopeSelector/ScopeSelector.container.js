// @flow
import React, { type ComponentType, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { ScopeSelectorComponent } from './ScopeSelector.component';
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
        onSetOrgUnit(orgUnitId);
    };

    const lockedSelectorLoads: string = useSelector(({ activePage }) => activePage.lockedSelectorLoads);
    const ready = deriveReadiness(lockedSelectorLoads, selectedOrgUnitId, selectedOrgUnit.name);

    return (
        <ScopeSelectorComponent
            onResetProgramId={onResetProgramId}
            onResetOrgUnitId={onResetOrgUnitId}
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
