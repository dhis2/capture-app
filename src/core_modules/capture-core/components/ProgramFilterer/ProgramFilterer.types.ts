import type { ReactNode } from 'react';
import type { Program } from '../../metaData';

export type ProgramFiltererProps = {
    orgUnitIds?: Array<string> | null;
    baselineFilter: (program: Program) => boolean;
    children: (programs: Array<Program>, isFiltered: boolean, passOnProps: Record<string, any>) => ReactNode;
};
