import type { ReactNode } from 'react';

export type Props = {
    selectedOrgUnitId?: string;
    selectedProgramId?: string | null;
    selectedCategories: Record<string, any>;
    selectedOrgUnit: Record<string, any>;
    previousOrgUnitId?: string;
    onSetOrgUnit?: (orgUnitId: string, orgUnitObject: Record<string, any>) => void;
    onSetProgramId?: (programId: string) => void;
    onSetCategoryOption?: (categoryOption: Record<string, any>, categoryId: string) => void;
    onResetOrgUnitId: () => void;
    onResetProgramId: (baseAction: any) => void;
    onResetCategoryOption?: (categoryId: string) => void;
    onResetAllCategoryOptions?: () => void;
    onStartAgain: () => void;
    formIsOpen: boolean;
    children: ReactNode;
    isReadOnlyOrgUnit?: boolean;
    orgUnitTooltip?: boolean;
    isUserInteractionInProgress?: boolean;
};
