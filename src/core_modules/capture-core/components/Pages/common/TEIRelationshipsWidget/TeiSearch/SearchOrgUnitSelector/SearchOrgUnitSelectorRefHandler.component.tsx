import * as React from 'react';
import { SearchOrgUnitSelector } from './SearchOrgUnitSelector.component';

type Props = {
    innerRef?: any;
    searchId: string;
    onSelectOrgUnitScope: (searchId: string, orgUnitScope: string) => void;
    onSetOrgUnit: (searchId: string, orgUnit?: Record<string, unknown>) => void;
    onFilterOrgUnits: (searchId: string, searchText: string) => void;
};

export const SearchOrgUnitSelectorRefHandler = (props: Props) => {
    const { innerRef, ...passOnProps } = props;
    return (
        <SearchOrgUnitSelector
            {...passOnProps}
        />
    );
};
