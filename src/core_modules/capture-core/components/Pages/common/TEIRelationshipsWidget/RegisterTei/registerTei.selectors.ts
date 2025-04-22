import { createSelector } from 'reselect';
import {
    getTrackedEntityTypeThrowIfNotFound,
} from '../../../../../metaData';

type State = {
    newRelationship: {
        selectedRelationshipType: {
            to: {
                trackedEntityTypeId: string;
            };
        };
    };
};

const TETIdSelector = (state: State) => state.newRelationship.selectedRelationshipType.to.trackedEntityTypeId;

export const makeTETNameSelector = () => createSelector(
    TETIdSelector,
    (TETId: string): string | null => {
        let TEType;
        try {
            TEType = getTrackedEntityTypeThrowIfNotFound(TETId);
        } catch (error: unknown) {
            return null;
        }

        return TEType.name;
    },
);
