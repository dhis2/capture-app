import type {
    VirtualizedOptionConfig,
} from '../../FormFields/Options/SelectVirtualizedV2/OptionsSelectVirtualized.component';

export type SearchProgramSelectorProps = {
    searchId: string;
    selectedProgramId?: string;
    onSetProgram: (searchId: string, programId?: string) => void;
    programOptions: Array<VirtualizedOptionConfig>;
};

export type StartSetProgramPayload = {
    searchId: string;
    programId?: string;
};
