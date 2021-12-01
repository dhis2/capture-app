// @flow
import { createSelector } from 'reselect';
import { TrackerProgram } from '../../../metaData';
import { programCollection } from '../../../metaDataMemoryStores';

const trackedEntityTypeIdSelector = (state, props) => state.teiSearch[props.searchId].selectedTrackedEntityTypeId;

// $FlowFixMe
export const makeProgramOptionsSelector = () => createSelector(
    trackedEntityTypeIdSelector,
    (trackedEntityTypeId: string) =>
        Array.from(programCollection.values())
            .filter(program =>
                program instanceof TrackerProgram &&
                program.trackedEntityType.id === trackedEntityTypeId &&
                program.access.data.read,
            )
            .map(p => ({ value: p.id, label: p.name })),
);
