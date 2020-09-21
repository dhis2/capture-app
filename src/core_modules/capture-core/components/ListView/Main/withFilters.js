// @flow
import * as React from 'react';
import { Filters } from '../Filters';
import type { Columns } from '../types';

type Props = {
    columns: Columns,
    onFilterUpdate: Function,
    onClearFilter: Function,
    onRestMenuItemSelected: Function,
    stickyFilters: Object,
};

export const withFilters = () => (InnerComponent: React.ComponentType<any>) =>
    ({ columns, onFilterUpdate, onClearFilter, onRestMenuItemSelected, stickyFilters, ...passOnProps }: Props) => (
        <InnerComponent
            {...passOnProps}
            columns={columns}
            filters={
                <Filters
                    columns={columns}
                    onFilterUpdate={onFilterUpdate}
                    onClearFilter={onClearFilter}
                    onRestMenuItemSelected={onRestMenuItemSelected}
                    stickyFilters={stickyFilters}
                />
            }
        />
    );
