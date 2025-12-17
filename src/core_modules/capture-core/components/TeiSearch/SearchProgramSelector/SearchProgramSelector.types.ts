export type SelectOption = {
    label: string;
    value: any;
    icon?: React.ReactNode | null;
};

export type SearchProgramSelectorProps = {
    searchId: string;
    selectedProgramId?: string;
    onSetProgram: (searchId: string, programId?: string) => void;
    programOptions: Array<SelectOption>;
};

export type StartSetProgramPayload = {
    searchId: string;
    programId?: string;
};
