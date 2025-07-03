import React from 'react';


export const TeiSearchResultsComponent = ({ getResultsView, ...passOnProps }) => (
    <div>
        { getResultsView && getResultsView(passOnProps)}
    </div>
);

