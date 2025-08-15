import * as React from 'react';
import { pipe } from 'capture-core-utils';
import { programCollection } from '../../metaDataMemoryStores';
import type { Program } from '../../metaData';
import type { ProgramFiltererProps } from './ProgramFilterer.types';

export class ProgramFilterer extends React.Component<ProgramFiltererProps> {
    static isBeingFiltered(basePrograms: Array<Program>, filteredPrograms: Array<Program>) {
        return basePrograms.length !== filteredPrograms.length;
    }

    constructor(props: ProgramFiltererProps) {
        super(props);
        this.programs = Array.from(programCollection.values());
    }

    getBaselinePrograms(programs: Array<Program>): Array<Program> {
        const { baselineFilter } = this.props;
        return programs
            .filter(program => baselineFilter(program));
    }

    getPrograms(basePrograms: Array<Program>) {
        return pipe(
            this.filterPrograms,
        )(basePrograms);
    }

    filterPrograms = (programs: Array<Program>): Array<Program> => {
        const { orgUnitIds } = this.props;

        return programs
            .filter(program =>
                (!orgUnitIds || orgUnitIds.some(id => program.organisationUnits[id])),
            );
    }

    programs: Array<Program>;

    render() {
        const { orgUnitIds, baselineFilter, children, ...passOnProps } = this.props;
        const basePrograms = this.getBaselinePrograms(this.programs);
        const filteredPrograms = this.getPrograms(basePrograms);

        return children(
            filteredPrograms,
            ProgramFilterer.isBeingFiltered(basePrograms,
                filteredPrograms,
            ), passOnProps);
    }
}
