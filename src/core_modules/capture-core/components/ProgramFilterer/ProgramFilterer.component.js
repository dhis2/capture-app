// @flow
import * as React from 'react';
import { pipe } from 'capture-core-utils';
import { programCollection } from '../../metaDataMemoryStores';
import type { Program } from '../../metaData';

type Props = {
  orgUnitIds: ?Array<string>,
  baselineFilter: (program: Program) => boolean,
  children: (programs: Array<Program>, isFiltered: boolean, passOnProps: Object) => React.Node,
};

// Filter programs based on organisation units and a baseline filter. Uses a render prop for children.
class ProgramFilterer extends React.Component<Props> {
  static isBeingFiltered(basePrograms: Array<Program>, filteredPrograms: Array<Program>) {
    return basePrograms.length !== filteredPrograms.length;
  }

  programs: Array<Program>;

  constructor(props: Props) {
    super(props);
    this.programs = Array.from(programCollection.values());
  }

  getBaselinePrograms(programs: Array<Program>): Array<Program> {
    const { baselineFilter } = this.props;
    return programs.filter((program) => baselineFilter(program));
  }

  filterPrograms = (programs: Array<Program>): Array<Program> => {
    const { orgUnitIds } = this.props;

    return programs.filter(
      (program) => !orgUnitIds || orgUnitIds.some((id) => program.organisationUnits[id]),
    );
  };

  getPrograms(basePrograms: Array<Program>) {
    return pipe(this.filterPrograms)(basePrograms);
  }

  render() {
    const { orgUnitIds, baselineFilter, children, ...passOnProps } = this.props;
    const basePrograms = this.getBaselinePrograms(this.programs);
    const filteredPrograms = this.getPrograms(basePrograms);

    return children(
      filteredPrograms,
      ProgramFilterer.isBeingFiltered(basePrograms, filteredPrograms),
      passOnProps,
    );
  }
}

export default ProgramFilterer;
