// @flow
import React from 'react';
import type { Props } from './TeiSearchResults.types';


export const TeiSearchResultsComponent = ({ getResultsView, ...passOnProps }: Props) => (
    <div>
        { getResultsView && getResultsView(passOnProps)}
    </div>
);

