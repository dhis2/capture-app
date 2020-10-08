// @flow
import React from 'react';
import type { Props } from './TeiSearchResults.container';


export const TeiSearchResultsComponent = ({ getResultsView, ...passOnProps }: Props) => (
    <div>
        { getResultsView && getResultsView(passOnProps)}
    </div>
);

