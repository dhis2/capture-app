import { createSelector } from 'reselect';

const searchIdSelector = () => 'relationshipTeiSearch';

export const makeSearchIdSelector = () => createSelector(
    [searchIdSelector],
    searchId => searchId,
);
