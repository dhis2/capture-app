// @flow
import React, { useContext } from 'react';
import {
    FilterValuesContext,
} from '../../listView.context';
import { FilterButtonTextBuilder } from './FilterButtonTextBuilder.component';
import type { Props } from './filterButtonContextConsumer.types';

export const FilterButtonContextConsumer = ({ itemId, ...passOnProps }: Props) => {
    const filterValues = useContext(FilterValuesContext);
    const filterValue = (filterValues && filterValues[itemId]) || undefined;

    return (
        <FilterButtonTextBuilder
            {...passOnProps}
            itemId={itemId}
            filterValue={filterValue}
        />
    );
};
