// @flow
import { getContext } from '../context';
import {
    storeProgramRules,
    storeProgramRulesVariables,
    storeProgramIndicators,
} from './quickStoreOperations';

/**
 * Load program rules, program rules variables and program indicators
 * @param {string[]} programIds: ids for programs to load
 */
export const loadRulesCentricMetadata = (programIds: Array<string>) => {
    const { storageController, storeNames } = getContext();

    /**
     * Gets the ids from IndexedDB for the specified programs
     * (ids being program rule ids, program variable ids or program indicator ids)
     * @param {string} storeName: name of the store
     */
    const getCachedIds = async (storeName): Promise<Array<string>> =>
        // $FlowFixMe
        (await Promise.all(
            programIds
                .map(programId =>
                    storageController.getAll(
                        storeName, {
                            project: item => item.id,
                            onIDBGetRequest: source => source
                                .index('programId')
                                .openCursor(IDBKeyRange.only(programId)),
                        },
                    ),
                ),
        )).flat(1);

    /**
     * Compares the ids that were retrieved from the api (and stored) to the ones in the cache.
     * Removes cache records that weren't retrieved from the api
     * @param {string[]} loadedIds: retrieved and stored ids
     * @param {string[]} cachedIds: ids in the cache
     * @param {string} storeName: name of the store
     */
    const removeUnavailableRecords = async (loadedIds, cachedIds, storeName) => {
        const loadedIdsAsObject = loadedIds
            .reduce((acc, ruleId) => {
                acc[ruleId] = ruleId;
                return acc;
            }, {});

        const unavailableIds = cachedIds
            .filter(cachedId => !loadedIdsAsObject[cachedId]);

        unavailableIds.length > 0 && await storageController.remove(storeName, unavailableIds);
    };

    /**
     * Retrieves data from the api and stores it in IndexedDB. Removes cached programs that is no longer available.
     * @param {string} storeName: The name of the store
     * @param {function} storeFn: The callback function that executes the storing
     */
    const load = async ({ storeName, storeFn }) => {
        const loadedIds = await storeFn(programIds);
        const cachedIds = await getCachedIds(storeName);
        await removeUnavailableRecords(loadedIds, cachedIds, storeName);
    };

    const loaderSpecs = [{
        storeName: storeNames.PROGRAM_RULES_VARIABLES,
        storeFn: storeProgramRulesVariables,
    }, {
        storeName: storeNames.PROGRAM_RULES,
        storeFn: storeProgramRules,
    }, {
        storeName: storeNames.PROGRAM_INDICATORS,
        storeFn: storeProgramIndicators,
    }];

    return Promise.all(
        loaderSpecs.map(spec => load(spec)),
    );
};
