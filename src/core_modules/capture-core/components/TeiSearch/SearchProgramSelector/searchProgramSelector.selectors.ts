import { createSelector } from 'reselect';
import { programCollection } from '../../../metaDataMemoryStores';
import { TrackerProgram } from '../../../metaData';

const trackedEntityTypeIdSelector = (state: any, props: any) => state.teiSearch[props.searchId].selectedTrackedEntityTypeId;

export const makeProgramOptionsSelector = () => createSelector(
    trackedEntityTypeIdSelector,
    (trackedEntityTypeId: string) =>
        Array.from(programCollection.values())
            .filter((program: any) =>
                program instanceof TrackerProgram &&
                program.trackedEntityType.id === trackedEntityTypeId &&
                program.access.data.read,
            )
            .map((p: any) => ({ value: p.id, label: p.name })),
);
