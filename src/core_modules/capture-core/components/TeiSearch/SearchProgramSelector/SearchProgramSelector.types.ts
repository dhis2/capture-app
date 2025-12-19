export type SearchProgramSelectorProps = {
    searchId: string;
    selectedProgramId?: string;
    onSetProgram: (searchId: string, programId?: string) => void;
    programOptions: Array<{ label: string; value: string }>;
};

export type StartSetProgramPayload = {
    searchId: string;
    programId?: string;
};
