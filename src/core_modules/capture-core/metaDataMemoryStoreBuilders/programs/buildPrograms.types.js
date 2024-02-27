// @flow
import type {
    CachedOptionSet,
    CachedTrackedEntityAttribute,
    CachedTrackedEntityType,
} from '../../storageControllers/cache.types';
import type { TrackedEntityType } from '../../metaData';

export type BuildProgramsInput = {|
    locale: string,
    cachedOptionSets: Map<string, CachedOptionSet>,
    cachedTrackedEntityAttributes: Map<string, CachedTrackedEntityAttribute>,
    cachedTrackedEntityTypes: Map<string, CachedTrackedEntityType>,
    trackedEntityTypeCollection: Map<string, TrackedEntityType>,
    minorServerVersion: number,
|};
