import { programCollection } from '../../../../../../metaDataMemoryStores';
import { TrackerProgram } from '../../../../../../metaData';
import { type VirtualizedOptionConfig } from '../../../../../FormFields/Options/SelectVirtualizedV2/OptionsSelectVirtualized.component';

export const getProgramOptions = (trackedEntityTypeId: string): Array<VirtualizedOptionConfig> => Array.from(programCollection.values())
    .filter((program: any) =>
        program instanceof TrackerProgram &&
        program.trackedEntityType.id === trackedEntityTypeId &&
        program.access.data.read,
    )
    .map((p: any) => ({ value: p.id, label: p.name }));
