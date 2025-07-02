import log from 'loglevel';
import { errorCreator } from 'capture-core-utils';
import { createSelector } from 'reselect';
import type { TrackedEntityType } from '../../../../../../metaData';
import { getTrackedEntityTypeThrowIfNotFound } from '../../../../../../metaData';

const trackedEntityTypeIdSelector = (state: any) => state.newRelationship.selectedRelationshipType.to.trackedEntityTypeId;

export const makeTeiRegistrationMetadataSelector = () => createSelector(
    trackedEntityTypeIdSelector,
    (TETypeId: string) => {
        let TEType: TrackedEntityType;
        try {
            TEType = getTrackedEntityTypeThrowIfNotFound(TETypeId);
        } catch (error) {
            log.error(errorCreator('Could not get TrackedEntityType for id')({ TETypeId, error }));
            return null;
        }

        return TEType.teiRegistration;
    },
);
