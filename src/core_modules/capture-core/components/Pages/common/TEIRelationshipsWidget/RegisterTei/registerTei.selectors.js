// @flow

import { createSelector } from 'reselect';
import {
    getTrackedEntityTypeThrowIfNotFound,
} from '../../../../../metaData';

const TETIdSelector = state => state.newRelationship.selectedRelationshipType.to.trackedEntityTypeId;

// $FlowFixMe
export const makeTETNameSelector = () => createSelector(
    TETIdSelector,
    (TETId: string) => {
        let TEType;
        try {
            TEType = getTrackedEntityTypeThrowIfNotFound(TETId);
        } catch (error) {
            return null;
        }

        return TEType.name;
    },
);
