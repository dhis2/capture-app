// @flow
import * as React from 'react';
import { Filters } from '../Filters';
import type { Columns, FiltersOnly, AdditionalFilters } from '../types';

type Props = {
    columns: Columns,
    filtersOnly?: FiltersOnly,
    additionalFilters?: AdditionalFilters,
    onUpdateFilter: Function,
    onClearFilter: Function,
    onSelectRestMenuItem: Function,
    stickyFilters: Object,
};

export const withFilters = () => (InnerComponent: React.ComponentType<any>) =>
    ({ columns,
        filtersOnly,
        additionalFilters,
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
                    filtersOnly={filtersOnly}
                    additionalFilters={additionalFilters}
                    onUpdateFilter={onUpdateFilter}
                    onClearFilter={onClearFilter}
                    onSelectRestMenuItem={onSelectRestMenuItem}
                    stickyFilters={stickyFilters}
                />
            }
        />
    );
