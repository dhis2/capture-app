// @flow
/* eslint-disable no-underscore-dangle */
import type {
    CachedOptionSet,
} from '../../../capture-core/storageControllers/cache.types';

class OptionSetStore {
    _optionSets: { [id: string]: CachedOptionSet };
    constructor() {
        this._optionSets = {};
    }

    set(optionSets: Map<string, CachedOptionSet>) {
        optionSets.forEach((value, key) => {
            this._optionSets[key] = value;
        });
    }

    get() {
        return this._optionSets;
    }
}

export default new OptionSetStore();
