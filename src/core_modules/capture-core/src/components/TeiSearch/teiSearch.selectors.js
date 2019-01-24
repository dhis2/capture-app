// @flow
import log from 'loglevel';
import { createSelector } from 'reselect';
import errorCreator from '../../utils/errorCreator';
import getSearchGroups from './getSearchGroups';
import { trackedEntityTypesCollection, programCollection } from '../../metaDataMemoryStores';

const trackedEntityTypeIdSelector = (state, props) => state.teiSearch[props.id].selectedTrackedEntityTypeId;
const programIdSelector = (state, props) => state.teiSearch[props.id].selectedProgramId;

export const makeSearchGroupsSelector = () => createSelector(
    trackedEntityTypeIdSelector,
    programIdSelector,
    (trackedEntityTypeId: string, programId: ?string) => getSearchGroups(trackedEntityTypeId, programId),
);
