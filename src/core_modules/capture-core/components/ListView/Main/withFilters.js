// @flow
import * as React from 'react';
import type { Columns, FiltersOnly } from '../types';
import { Filters } from '../Filters';

type Props = {
    columns: Columns,
    filtersOnly?: FiltersOnly,
    onUpdateFilter: Function,
    onClearFilter: Function,
    onSelectRestMenuItem: Function,
    stickyFilters: Object,
};

export const withFilters = () => (InnerComponent: React.ComponentType<any>) =>
    ({ columns, filtersOnly, onUpdateFilter, onClearFilter, onSelectRestMenuItem, stickyFilters, ...passOnProps }: Props) => (
        <InnerComponent
            {...passOnProps}
            columns={columns}
            filters={
                <Filters
                    columns={columns}
                    filtersOnly={filtersOnly}
                    onUpdateFilter={onUpdateFilter}
                    onClearFilter={onClearFilter}
                    onSelectRestMenuItem={onSelectRestMenuItem}
                    stickyFilters={stickyFilters}
                />
            }
        />
    );
