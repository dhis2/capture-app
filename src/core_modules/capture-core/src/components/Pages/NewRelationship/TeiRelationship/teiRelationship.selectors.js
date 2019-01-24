// @flow
import { createSelector } from 'reselect';
import { trackedEntityTypesCollection } from '../../../../metaDataMemoryStores';

const trackedEntityTypeIdSelector = props => props.selectedRelationshipType.to.trackedEntityTypeId;

export const makeTrackedEntityTypeSelector = () => createSelector(
    trackedEntityTypeIdSelector,
    (trackedEntityTypeId: string) => trackedEntityTypesCollection.get(trackedEntityTypeId),
);
