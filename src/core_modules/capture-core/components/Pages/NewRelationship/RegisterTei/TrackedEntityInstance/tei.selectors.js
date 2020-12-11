// @flow
import log from 'loglevel';
import { errorCreator } from 'capture-core-utils';
import { createSelector } from 'reselect';
import { getTrackedEntityTypeThrowIfNotFound, TrackedEntityType } from '../../../../../metaData';

const trackedEntityTypeIdSelector = (state) =>
  state.newRelationship.selectedRelationshipType.to.trackedEntityTypeId;

export const makeTeiRegistrationMetadataSelector = () =>
  // $FlowFixMe[missing-annot] automated comment
  createSelector(trackedEntityTypeIdSelector, (TETypeId: string) => {
    let TEType: TrackedEntityType;
    try {
      TEType = getTrackedEntityTypeThrowIfNotFound(TETypeId);
    } catch (error) {
      log.error(errorCreator('Could not get TrackedEntityType for id')({ TETypeId }));
      return null;
    }

    return TEType.teiRegistration;
  });
