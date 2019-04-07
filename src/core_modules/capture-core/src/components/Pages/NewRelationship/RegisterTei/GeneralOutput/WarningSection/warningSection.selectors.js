// @flow
import React from 'react';
import { createSelector } from 'reselect';
import SearchGroupDuplicate from './SearchGroupDuplicate/SearchGroupDuplicate.component';

const searchGroupCountSelector = (state, props) =>
    state.dataEntriesSearchGroupsResults[props.dataEntryKey] &&
    state.dataEntriesSearchGroupsResults[props.dataEntryKey].main.count;

// $FlowFixMe
export const makeGetSearchGroupWarning = () => createSelector(
    searchGroupCountSelector,
    (count: ?number) => {
        if (!count) {
            return null;
        }

        return {
            id: 'duplicateWarning',
            message: (
                <SearchGroupDuplicate />
            ),
        };
    },
);

const rulesWarningsSelector = (state, props) => state.rulesEffectsGeneralWarnings[props.dataEntryKey];
// $FlowFixMe
export const makeGetWarningMessages = () => createSelector(
    rulesWarningsSelector,
    (state, props, searchGroupWarning) => searchGroupWarning,
    (rulesWarnings: Array<{id: string, message: string}>, searchGroupWarning: {id: string, message: string}) => {
        rulesWarnings = rulesWarnings || [];
        return (searchGroupWarning ? [...rulesWarnings, searchGroupWarning] : rulesWarnings);
    },
);
