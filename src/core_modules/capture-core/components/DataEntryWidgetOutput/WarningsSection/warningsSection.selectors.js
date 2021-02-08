// @flow
import React from 'react';
import { createSelector } from 'reselect';
import { SearchGroupDuplicate } from './SearchGroupDuplicate/SearchGroupDuplicate.component';

const searchGroupCountSelector = (state, props) =>
    state.dataEntriesSearchGroupsResults[props.dataEntryKey] &&
    state.dataEntriesSearchGroupsResults[props.dataEntryKey].main &&
    state.dataEntriesSearchGroupsResults[props.dataEntryKey].main.count;

const onLinkSelector = (state, props) => props.onLink;
const selectedScopeIdSelector = (_, props) => props.selectedScopeId;
const dataEntryIdSelector = (_, props) => props.dataEntryId;

// $FlowFixMe
export const makeGetSearchGroupWarning = () => createSelector(
    searchGroupCountSelector,
    onLinkSelector,
    selectedScopeIdSelector,
    dataEntryIdSelector,
    (count: ?number, onLink: Function, selectedScopeId: string, dataEntryId: string) => {
        if (!count) {
            return null;
        }
        return {
            id: 'duplicateWarning',
            message: (
                <SearchGroupDuplicate
                    dataEntryId={dataEntryId}
                    selectedScopeId={selectedScopeId}
                    onLink={onLink}
                />
            ),
        };
    },
);

const rulesWarningsSelector = (searchGroupWarning, rulesWarnings) => rulesWarnings;
// $FlowFixMe
export const makeGetWarningMessages = () => createSelector(
    rulesWarningsSelector,
    searchGroupWarning => searchGroupWarning,
    (rulesWarnings: Array<{id: string, message: string}>, searchGroupWarning: {id: string, message: string}) => {
        rulesWarnings = rulesWarnings || [];
        return (searchGroupWarning ? [...rulesWarnings, searchGroupWarning] : rulesWarnings);
    },
);
