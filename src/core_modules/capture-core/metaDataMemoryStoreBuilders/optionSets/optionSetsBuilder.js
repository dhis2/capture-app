// @flow
import { optionSetStore } from '../../metaDataMemoryStores/optionSets/optionSets.store';
import type {
    CachedOptionSet,
} from '../../storageControllers/cache.types';

export function buildOptionSets(cachedOptionSets: Array<CachedOptionSet>) {
    // $FlowFixMe
    optionSetStore.set(cachedOptionSets);
}
