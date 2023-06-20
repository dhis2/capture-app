// @flow
// $FlowFixMe
import { useSelector, shallowEqual } from 'react-redux';
import React from 'react';
import type { ContainerProps } from './SearchStatus.types';
import { SearchStatus as SearchStatusComponent } from './SearchStatus.component';

export const SearchStatus = (passOnProps: ContainerProps) => {
    const { uniqueTEAName } = useSelector(
        ({ searchDomain }) => ({
            uniqueTEAName: searchDomain.currentSearchInfo.uniqueTEAName,
        }),
        shallowEqual,
    );

    return <SearchStatusComponent uniqueTEAName={uniqueTEAName} {...passOnProps} />;
};
