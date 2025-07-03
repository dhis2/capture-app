import * as React from 'react';
import { SearchOrgUnitSelector } from './SearchOrgUnitSelector.component';

export const SearchOrgUnitSelectorRefHandler = (props) => {
    const { innerRef, ...passOnProps } = props;
    return (
        <SearchOrgUnitSelector
            ref={innerRef}
            {...passOnProps}
        />
    );
};
