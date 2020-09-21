// @flow
import React, { memo } from 'react';
import { FilterButtonContextConsumer } from './FilterButtonContextConsumer.component';

export const FilterButton = memo<$ReadOnly<{}>>((props: $ReadOnly<{}>) => (
    <FilterButtonContextConsumer
        {...props}
    />
));
