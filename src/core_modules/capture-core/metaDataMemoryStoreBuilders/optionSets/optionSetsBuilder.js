// @flow
import type {
    CachedOptionSet,
} from '../../storageControllers/cache.types';
import { optionSetStore } from '../../metaDataMemoryStores/optionSets/optionSets.store';

export function buildOptionSets(cachedOptionSets: Map<string, CachedOptionSet>) {
    optionSetStore.set(cachedOptionSets);
}
