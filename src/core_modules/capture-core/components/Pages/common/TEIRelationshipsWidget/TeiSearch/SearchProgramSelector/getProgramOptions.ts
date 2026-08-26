import { programCollection } from '../../../../../../metaDataMemoryStores';
import { TrackerProgram } from '../../../../../../metaData';

export const getProgramOptions = (trackedEntityTypeId: string) => Array.from(programCollection.values())
    .filter((program: any) =>
        program instanceof TrackerProgram &&
                program.trackedEntityType.id === trackedEntityTypeId &&
                program.access.data.read,
    )
    .map((p: any) => ({ value: p.id, label: p.name }));
