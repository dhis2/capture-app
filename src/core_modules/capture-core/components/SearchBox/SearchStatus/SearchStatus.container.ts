import { useSelector, shallowEqual } from 'react-redux';
import React from 'react';
import type { ContainerProps } from './SearchStatus.types';
import { SearchStatus as SearchStatusComponent } from './SearchStatus.component';

export const SearchStatus = (passOnProps: ContainerProps) => {
    const { uniqueTEAName, currentSearchTerms } = useSelector(
        ({ searchDomain }: any) => ({
            uniqueTEAName: searchDomain.currentSearchInfo.uniqueTEAName,
            currentSearchTerms: searchDomain.currentSearchInfo.currentSearchTerms,
        }),
        shallowEqual,
    );

    return React.createElement(SearchStatusComponent, {
        uniqueTEAName,
        currentSearchTerms,
        ...passOnProps,
    });
};
