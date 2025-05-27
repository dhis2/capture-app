// @flow
import type {
    CachedOption,
    CachedOptionSet,
} from 'capture-core/storageControllers/cache.types';
import type {
    OptionSet,
    OptionSets,
} from '@dhis2/rules-engine-javascript';

function convertOptionSet(optionSet: CachedOptionSet): OptionSet {
    const options = optionSet.options.map((option: CachedOption) => ({
        id: option.id,
        code: option.code,
        displayName: option.displayName,
    }));
    return {
        id: optionSet.id,
        displayName: optionSet.displayName,
        options,
    };
}

export function convertOptionSetsToRulesEngineFormat(
    cachedOptionSets: { [id: string]: CachedOptionSet }): OptionSets {
    const optionSets = {};
    Object.keys(cachedOptionSets).forEach((key: string) => {
        optionSets[key] = convertOptionSet(cachedOptionSets[key]);
    });
    return optionSets;
}
