import type { CachedOptionSet } from '../../../capture-core/storageControllers/cache.types';

class OptionSetStore {
    private _optionSets: Record<string, CachedOptionSet>;

    constructor() {
        this._optionSets = {};
    }

    set(optionSets: Map<string, CachedOptionSet>): void {
        optionSets.forEach((value, key) => {
            this._optionSets[key] = value;
        });
    }

    get(): Record<string, CachedOptionSet> {
        return this._optionSets;
    }
}

export const optionSetStore = new OptionSetStore();
