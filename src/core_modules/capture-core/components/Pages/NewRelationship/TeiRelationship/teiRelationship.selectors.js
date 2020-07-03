// @flow
import { createSelector } from 'reselect';
import { getTrackedEntityTypeThrowIfNotFound } from '../../../../metaData';

const trackedEntityTypeIdSelector = props => props.selectedRelationshipType.to.trackedEntityTypeId;

// $FlowFixMe[missing-annot] automated comment
export const makeTrackedEntityTypeSelector = () => createSelector(
    trackedEntityTypeIdSelector,
    (trackedEntityTypeId: string) => getTrackedEntityTypeThrowIfNotFound(trackedEntityTypeId),
);
