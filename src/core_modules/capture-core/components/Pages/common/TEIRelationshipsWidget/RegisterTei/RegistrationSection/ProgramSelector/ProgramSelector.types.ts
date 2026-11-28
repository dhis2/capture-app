import type { ReactElement } from 'react';

export type ProgramSelectorProps = {
    trackedEntityTypeId: string;
};

export type ProgramSelectorComponentProps = {
    trackedEntityTypeId: string;
};

export type ComposedProgramSelectorProps = {
    value: string;
    trackedEntityTypeId: string;
    onUpdateSelectedProgram: (programId: string) => void;
    programLabelClass?: string;
    label?: string;
    dataTest?: string;
};

export type ProgramOption = {
    label: string;
    value: string;
    iconLeft?: ReactElement | undefined;
};
