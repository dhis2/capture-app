// @flow
import * as React from 'react';
import { SearchOrgUnitSelector } from './SearchOrgUnitSelector.component';

type Props = {
    innerRef: Function,
};

export const SearchOrgUnitSelectorRefHandler = (props: Props) => {
    const { innerRef, ...passOnProps } = props;
    return (
        // $FlowFixMe[cannot-spread-inexact] automated comment
        <SearchOrgUnitSelector
            ref={innerRef}
            {...passOnProps}
        />
    );
};
