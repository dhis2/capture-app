// @flow

import React from 'react';
import { SelectorBar } from '@dhis2/ui';
import { ProgramSelector } from './Program/ProgramSelector.component';
import { OrgUnitSelector } from './OrgUnitSelector.component';
import type { Props } from './QuickSelector.types';

export const QuickSelector = ({
    selectedOrgUnitId,
    selectedProgramId,
    selectedCategories,
    selectedOrgUnit,
    previousOrgUnitId,
    onSetOrgUnit,
    onSetProgramId,
    onSetCategoryOption,
    onResetOrgUnitId,
    onResetProgramId,
    onResetCategoryOption,
    onResetAllCategoryOptions,
    formIsOpen,
    children,
    onStartAgain,
}: Props) => (
    <SelectorBar
        disableClearSelections={!selectedProgramId && !selectedOrgUnitId}
        onClearSelectionClick={() => onStartAgain()}
    >
        <ProgramSelector
            selectedProgramId={selectedProgramId}
            selectedOrgUnitId={selectedOrgUnitId}
            selectedCategories={selectedCategories}
            handleClickProgram={onSetProgramId}
            handleSetCatergoryCombo={onSetCategoryOption}
            handleResetCategorySelections={onResetAllCategoryOptions}
            buttonModeMaxLength={5}
            onResetProgramId={onResetProgramId}
            onResetCategoryOption={onResetCategoryOption}
            onResetOrgUnit={onResetOrgUnitId}
            formIsOpen={formIsOpen}
        />
        <OrgUnitSelector
            previousOrgUnitId={previousOrgUnitId}
            selectedOrgUnitId={selectedOrgUnitId}
            handleClickOrgUnit={onSetOrgUnit}
            selectedOrgUnit={selectedOrgUnit}
            onReset={onResetOrgUnitId}
        />
        {children}
    </SelectorBar>
);
