import * as React from 'react';
import { SearchOrgUnitSelector } from './SearchOrgUnitSelector.component';
import type { RefHandlerProps } from './SearchOrgUnitSelector.types';

export const SearchOrgUnitSelectorRefHandler = (props: RefHandlerProps) => {
    const { innerRef, ...passOnProps } = props;
    return (
        <SearchOrgUnitSelector
            ref={innerRef}
            {...passOnProps}
        />
    );
};
