// @flow
import React, { memo } from 'react';
import type { Props } from './filterButton.types';
import { FilterButtonContextConsumer } from './FilterButtonContextConsumer.component';

export const FilterButton = memo<Props>((props: Props) => (
    <FilterButtonContextConsumer
        {...props}
    />
));
