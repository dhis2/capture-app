// @flow
import type { TrackedEntityType } from '../../metaData';
import type {
    CachedOptionSet,
    CachedTrackedEntityAttribute,
    CachedTrackedEntityType,
} from '../../storageControllers/cache.types';

export type BuildProgramsInput = {|
    locale: string,
    cachedOptionSets: Map<string, CachedOptionSet>,
    cachedTrackedEntityAttributes: Map<string, CachedTrackedEntityAttribute>,
    cachedTrackedEntityTypes: Map<string, CachedTrackedEntityType>,
    trackedEntityTypeCollection: Map<string, TrackedEntityType>,
|};
