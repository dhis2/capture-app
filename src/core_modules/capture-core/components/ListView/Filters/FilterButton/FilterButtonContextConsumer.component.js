// @flow
import React, { useContext } from 'react';
import {
    FilterValuesContext,
} from '../../listView.context';
import type { Props } from './filterButtonContextConsumer.types';
import { FilterButtonTextBuilder } from './FilterButtonTextBuilder.component';

export const FilterButtonContextConsumer = ({ itemId, ...passOnProps }: Props) => {
    const filterValues = useContext(FilterValuesContext);
    const filterValue = (filterValues && filterValues[itemId]) || undefined;

    return (
        // $FlowFixMe fixed in later PR
        <FilterButtonTextBuilder
            {...passOnProps}
            itemId={itemId}
            filterValue={filterValue}
        />
    );
};
