// @flow
import * as React from 'react';
import { Filters } from '../Filters';
import type { Columns } from '../types';

type Props = {
  columns: Columns,
  onUpdateFilter: Function,
  onClearFilter: Function,
  onSelectRestMenuItem: Function,
  stickyFilters: Object,
};

export const withFilters = () => (InnerComponent: React.ComponentType<any>) => ({
  columns,
  onUpdateFilter,
  onClearFilter,
  onSelectRestMenuItem,
  stickyFilters,
  ...passOnProps
}: Props) => (
  <InnerComponent
    {...passOnProps}
    columns={columns}
    filters={
      <Filters
        columns={columns}
        onUpdateFilter={onUpdateFilter}
        onClearFilter={onClearFilter}
        onSelectRestMenuItem={onSelectRestMenuItem}
        stickyFilters={stickyFilters}
      />
    }
  />
);
