// @flow
import { getContext } from '../context';
import {
    storeProgramRules,
    storeProgramRulesVariables,
    storeProgramIndicators,
} from './quickStoreOperations';

export const loadRulesCentricMetadata = (programIds: Array<string>) => {
    const { storageController, storeNames } = getContext();

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
        ))
            .flat(1);

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
