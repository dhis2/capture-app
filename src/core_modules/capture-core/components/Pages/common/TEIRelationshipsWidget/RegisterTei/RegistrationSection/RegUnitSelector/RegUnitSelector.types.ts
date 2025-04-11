
export type RegUnitSelectorProps = {
    selectedProgramId?: string | null;
    classes: Record<string, string>;
    onUpdateSelectedOrgUnit: (orgUnit: Record<string, any> | null, resetProgramSelection: boolean) => void;
    programId: string;
};

export type ComposedRegUnitSelectorProps = {
    onUpdateSelectedOrgUnit: (orgUnit: Record<string, any> | null) => void;
    labelClass?: string;
    label?: string;
    formHorizontal?: boolean;
};
