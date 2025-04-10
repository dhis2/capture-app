import type { ReactElement } from 'react';

export type ProgramSelectorProps = {
    trackedEntityTypeId: string;
};

export type ProgramSelectorComponentProps = {
    classes: Record<string, string>;
};

export type ComposedProgramSelectorProps = {
    orgUnitIds?: string[] | null;
    value: string;
    trackedEntityTypeId: string;
    onUpdateSelectedProgram: (programId: string) => void;
    onClearFilter: () => void;
    programLabelClass?: string;
    label?: string;
    dataTest?: string;
};

export type ProgramOption = {
    label: string;
    value: string;
    iconLeft?: ReactElement | undefined;
};
