// @flow
import React, { memo } from 'react';
import { FilterButtonContextConsumer } from './FilterButtonContextConsumer.component';
import type { Props } from './filterButton.types';

export const FilterButton = memo<Props>((props: Props) => (
    <FilterButtonContextConsumer
        {...props}
    />
));
