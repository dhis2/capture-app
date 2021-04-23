// @flow
import optionSetsStore from '../../metaDataMemoryStores/optionSets/optionSets.store';
import type {
    CachedOptionSet,
} from '../../storageControllers/cache.types';

export default function buildOptionSets(cachedOptionSets: Map<string, CachedOptionSet>) {
    optionSetsStore.set(cachedOptionSets);
}
