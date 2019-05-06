// @flow
import { createSelector } from 'reselect';
import getSearchGroups from './getSearchGroups';

const trackedEntityTypeIdSelector = (state, props) => state.teiSearch[props.id].selectedTrackedEntityTypeId;
const programIdSelector = (state, props) => state.teiSearch[props.id].selectedProgramId;

export const makeSearchGroupsSelector = () => createSelector(
    trackedEntityTypeIdSelector,
    programIdSelector,
    (trackedEntityTypeId: string, programId: ?string) => getSearchGroups(trackedEntityTypeId, programId).sort((a, b) => a.unique === b.unique ? 0 : (a.unique ? -1 : 1)),
);
