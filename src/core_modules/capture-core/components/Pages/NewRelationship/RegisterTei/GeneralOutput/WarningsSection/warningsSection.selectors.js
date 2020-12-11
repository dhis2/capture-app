// @flow
import React from 'react';
import { createSelector } from 'reselect';
import SearchGroupDuplicate from './SearchGroupDuplicate/SearchGroupDuplicate.component';

const searchGroupCountSelector = (state, props) =>
  state.dataEntriesSearchGroupsResults[props.dataEntryKey] &&
  state.dataEntriesSearchGroupsResults[props.dataEntryKey].main &&
  state.dataEntriesSearchGroupsResults[props.dataEntryKey].main.count;

const onLinkSelector = (state, props) => props.onLink;

export const makeGetSearchGroupWarning = () =>
  // $FlowFixMe[missing-annot] automated comment
  createSelector(searchGroupCountSelector, onLinkSelector, (count: ?number, onLink: Function) => {
    if (!count) {
      return null;
    }

    return {
      id: 'duplicateWarning',
      message: <SearchGroupDuplicate onLink={onLink} />,
    };
  });

const rulesWarningsSelector = (searchGroupWarning, rulesWarnings) => rulesWarnings;
export const makeGetWarningMessages = () =>
  // $FlowFixMe[missing-annot] automated comment
  createSelector(
    rulesWarningsSelector,
    (searchGroupWarning) => searchGroupWarning,
    (
      rulesWarnings: Array<{ id: string, message: string }>,
      searchGroupWarning: { id: string, message: string },
    ) => {
      rulesWarnings = rulesWarnings || [];
      return searchGroupWarning ? [...rulesWarnings, searchGroupWarning] : rulesWarnings;
    },
  );
