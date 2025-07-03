import { programCollection } from '../../../../../../metaDataMemoryStores';
import { TrackerProgram } from '../../../../../../metaData';

export const getProgramOptions = (trackedEntityTypeId) => Array.from(programCollection.values())
    .filter(program =>
        program instanceof TrackerProgram &&
                program.trackedEntityType.id === trackedEntityTypeId &&
                program.access.data.read,
    )
    .map(p => ({ value: p.id, label: p.name }));
