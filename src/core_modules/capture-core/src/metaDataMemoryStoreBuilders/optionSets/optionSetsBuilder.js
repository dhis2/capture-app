// @flow
import optionSetsStore from '../../metaDataMemoryStores/optionSets/optionSets.store';
import type {
    CachedOptionSet,
} from '../cache.types';

export default function buildOptionSets(cachedOptionSets: Array<CachedOptionSet>) {
    // $FlowFixMe
    optionSetsStore.set(cachedOptionSets);
}
