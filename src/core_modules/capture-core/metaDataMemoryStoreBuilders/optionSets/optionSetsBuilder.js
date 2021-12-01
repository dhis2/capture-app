// @flow
import { optionSetStore } from '../../metaDataMemoryStores/optionSets/optionSets.store';
import type {
    CachedOptionSet,
} from '../../storageControllers/cache.types';

export function buildOptionSets(cachedOptionSets: Map<string, CachedOptionSet>) {
    optionSetStore.set(cachedOptionSets);
}
