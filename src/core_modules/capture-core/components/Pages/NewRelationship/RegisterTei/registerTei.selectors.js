// @flow

import { createSelector } from 'reselect';
import { getTrackedEntityTypeThrowIfNotFound } from '../../../../metaData';

const TETIdSelector = (state) =>
  state.newRelationship.selectedRelationshipType.to.trackedEntityTypeId;

export const makeTETNameSelector = () =>
  // $FlowFixMe[missing-annot] automated comment
  createSelector(TETIdSelector, (TETId: string) => {
    let TEType;
    try {
      TEType = getTrackedEntityTypeThrowIfNotFound(TETId);
    } catch (error) {
      return null;
    }

    return TEType.name;
  });
