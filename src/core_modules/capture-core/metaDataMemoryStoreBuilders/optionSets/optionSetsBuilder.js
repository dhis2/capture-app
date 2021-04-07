// @flow
import { optionSetsStore } from '../../metaDataMemoryStores/optionSets/optionSets.store';
import type {
    CachedOptionSet,
} from '../../storageControllers/cache.types';

export function buildOptionSets(cachedOptionSets: Array<CachedOptionSet>) {
    // $FlowFixMe
    optionSetsStore.set(cachedOptionSets);
}
