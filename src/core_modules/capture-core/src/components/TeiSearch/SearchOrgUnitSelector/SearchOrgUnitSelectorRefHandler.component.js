// @flow
import * as React from 'react';
import SearchOrgUnitSelector from './SearchOrgUnitSelector.component';

type Props = {
    innerRef: Function,
};

const SearchOrgUnitSelectorRefHandler = (props: Props) => {
    const { innerRef, ...passOnProps } = props;
    return (
        <SearchOrgUnitSelector
            ref={innerRef}
            {...passOnProps}
        />
    );
};

export default SearchOrgUnitSelectorRefHandler;
