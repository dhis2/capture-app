// @flow
import React, { type ComponentType, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ScopeSelectorComponent } from './ScopeSelector.component';
import type { OwnProps } from './ScopeSelector.types';
import { useOrgUnitName } from '../../metadataRetrieval/orgUnitName';
import { resetOrgUnitIdFromScopeSelector } from './ScopeSelector.actions';


const deriveReadiness = (lockedSelectorLoads, selectedOrgUnitId, selectedOrgUnitName, displayName) => {
    // because we want the orgUnit to be fetched and stored
    // before allowing the user to view the locked selector
    if (selectedOrgUnitId && (!selectedOrgUnitName || selectedOrgUnitName !== displayName)) {
        return false;
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
    onStartAgain,
    children,
}) => {
    const dispatch = useDispatch();
    const [selectedOrgUnit, setSelectedOrgUnit] = useState({ name: undefined, id: selectedOrgUnitId });
    const { displayName } = useOrgUnitName(selectedOrgUnit.id);

    useEffect(() => {
        if (displayName && selectedOrgUnit.name !== displayName) {
            setSelectedOrgUnit(prevSelectedOrgUnit => ({ ...prevSelectedOrgUnit, name: displayName }));
        }
    }, [displayName, selectedOrgUnit, setSelectedOrgUnit]);

    useEffect(() => {
        if (selectedOrgUnitId && !selectedOrgUnit.id) {
            selectedOrgUnitId && setSelectedOrgUnit(prevSelectedOrgUnit => ({ ...prevSelectedOrgUnit, id: selectedOrgUnitId }));
        }
    }, [selectedOrgUnitId, selectedOrgUnit, setSelectedOrgUnit]);

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
    const ready = deriveReadiness(lockedSelectorLoads, selectedOrgUnit.id, selectedOrgUnit.name, displayName);

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
            previousOrgUnitId={previousOrgUnitId}
            selectedOrgUnit={selectedOrgUnit}
            selectedOrgUnitId={selectedOrgUnitId}
            selectedProgramId={selectedProgramId}
            selectedCategories={selectedCategories}
            isUserInteractionInProgress={isUserInteractionInProgress}
            onStartAgain={onStartAgain}
            ready={ready}
        >
            {children}
        </ScopeSelectorComponent>
    );
};
