// @flow
import { createSelector } from 'reselect';
import getSearchGroups from './getSearchGroups';

const trackedEntityTypeIdSelector = (state, props) => state.teiSearch[props.id].selectedTrackedEntityTypeId;
const programIdSelector = (state, props) => state.teiSearch[props.id].selectedProgramId;

// $FlowFixMe[missing-annot] automated comment
export const makeSearchGroupsSelector = () => createSelector(
    trackedEntityTypeIdSelector,
    programIdSelector,
    (trackedEntityTypeId: string, programId: ?string) =>
        getSearchGroups(trackedEntityTypeId, programId)
            .sort((a, b) => {
                if (a.unique === b.unique) {
                    return 0;
                }
                if (a.unique) {
                    return -1;
                }
                return 1;
            }),
);
