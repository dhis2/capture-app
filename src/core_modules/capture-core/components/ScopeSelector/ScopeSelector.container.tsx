import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ScopeSelectorComponent } from './ScopeSelector.component';
import type { OwnProps } from './ScopeSelector.types';
import { useOrgUnitNameWithAncestors } from '../../metadataRetrieval/orgUnitName';
import { resetOrgUnitIdFromScopeSelector } from './ScopeSelector.actions';


const deriveReadiness = (
    lockedSelectorLoads: boolean, 
    selectedOrgUnitId?: string | null, 
    selectedOrgUnitName?: string, 
    displayName?: string, 
    ouNameError?: any
) => {
    // because we want the orgUnit to be fetched and stored
    // before allowing the user to view the locked selector
    if (!ouNameError && selectedOrgUnitId && 
        (!selectedOrgUnitName || selectedOrgUnitName !== displayName)) {
        return false;
    }
    return !lockedSelectorLoads;
};

export const ScopeSelector = ({
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
    formIsOpen = false,
    children,
    isReadOnlyOrgUnit,
    orgUnitTooltip,
}: OwnProps) => {
    const dispatch = useDispatch();
    const [selectedOrgUnit, setSelectedOrgUnit] = useState<{ name?: string; id?: string | null }>({ 
        name: undefined, 
        id: selectedOrgUnitId 
    });
    const { displayName, error: ouNameError } = useOrgUnitNameWithAncestors(selectedOrgUnit.id);

    useEffect(() => {
        if (displayName && selectedOrgUnit.name !== displayName) {
            setSelectedOrgUnit(prevSelectedOrgUnit => ({ ...prevSelectedOrgUnit, name: displayName }));
        }
    }, [displayName, selectedOrgUnit, setSelectedOrgUnit]);

    useEffect(() => {
        if (selectedOrgUnitId && selectedOrgUnit.id !== selectedOrgUnitId) {
            selectedOrgUnitId && 
                setSelectedOrgUnit(prevSelectedOrgUnit => ({ ...prevSelectedOrgUnit, id: selectedOrgUnitId }));
        }
    }, [selectedOrgUnitId, selectedOrgUnit, setSelectedOrgUnit]);

    const handleSetOrgUnit = (orgUnitId: string, orgUnitObject: Record<string, any>) => {
        setSelectedOrgUnit(orgUnitObject);
        onSetOrgUnit && onSetOrgUnit(orgUnitId, orgUnitObject);
    };

    const { lockedSelectorLoads, previousOrgUnitId } = useSelector(({ activePage, app }: any) => (
        {
            lockedSelectorLoads: activePage.lockedSelectorLoads,
            previousOrgUnitId: app.previousOrgUnitId,
        }
    ));
    const ready = deriveReadiness(lockedSelectorLoads, selectedOrgUnit.id, selectedOrgUnit.name, displayName, ouNameError);

    return (
        <ScopeSelectorComponent
            onResetProgramId={onResetProgramId}
            onResetOrgUnitId={() => {
                selectedOrgUnit && 
                    dispatch(resetOrgUnitIdFromScopeSelector(selectedOrgUnit?.id ?? undefined));
                return onResetOrgUnitId();
            }}
            onResetAllCategoryOptions={onResetAllCategoryOptions}
            onResetCategoryOption={onResetCategoryOption}
            onSetCategoryOption={onSetCategoryOption}
            onSetProgramId={onSetProgramId}
            onSetOrgUnit={handleSetOrgUnit}
            previousOrgUnitId={previousOrgUnitId}
            selectedOrgUnit={{ ...selectedOrgUnit, name: ouNameError ? undefined : selectedOrgUnit.name }}
            selectedOrgUnitId={selectedOrgUnitId}
            selectedProgramId={selectedProgramId}
            selectedCategories={selectedCategories}
            isUserInteractionInProgress={isUserInteractionInProgress}
            formIsOpen={formIsOpen}
            onStartAgain={onStartAgain}
            isReadOnlyOrgUnit={isReadOnlyOrgUnit}
            orgUnitTooltip={orgUnitTooltip}
            ready={ready}
        >
            {children}
        </ScopeSelectorComponent>
    );
};
