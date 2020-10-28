// @flow
import { createSelector } from 'reselect';
import { programCollection } from '../../../metaDataMemoryStores';
import { TrackerProgram } from '../../../metaData';

const trackedEntityTypeIdSelector = (state, props) => state.teiSearch[props.searchId].selectedTrackedEntityTypeId;

// $FlowFixMe
export const makeProgramOptionsSelector = () => createSelector(
    trackedEntityTypeIdSelector,
    (trackedEntityTypeId: string) =>
        Array.from(programCollection.values())
            .filter(program =>
                Boolean(
                    program instanceof TrackerProgram &&
                    program.trackedEntityType &&
                    program.trackedEntityType.id === trackedEntityTypeId &&
                    program.access.data.read,
                ),
            )
            .map(p => ({ value: p.id, label: p.name })),
);
