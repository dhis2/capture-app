import * as React from 'react';
import { SearchOrgUnitSelector } from './SearchOrgUnitSelector.component';
import type { SearchOrgUnitSelectorProps } from './SearchOrgUnitSelector.types';

type Props = SearchOrgUnitSelectorProps & {
    innerRef: any;
};

export const SearchOrgUnitSelectorRefHandler = (props: Props) => {
    const { innerRef, ...passOnProps } = props;
    return (
        <SearchOrgUnitSelector
            ref={innerRef}
            {...passOnProps}
        />
    );
};
