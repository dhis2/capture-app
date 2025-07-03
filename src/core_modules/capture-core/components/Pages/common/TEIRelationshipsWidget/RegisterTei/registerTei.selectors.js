import { createSelector } from 'reselect';
import {
    getTrackedEntityTypeThrowIfNotFound,
} from '../../../../../metaData';

const TETIdSelector = state => state.newRelationship.selectedRelationshipType.to.trackedEntityTypeId;

export const makeTETNameSelector = () => createSelector(
    TETIdSelector,
    (TETId) => {
        let TEType;
        try {
            TEType = getTrackedEntityTypeThrowIfNotFound(TETId);
        } catch (error) {
            return null;
        }

        return TEType.name;
    },
);
