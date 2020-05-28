// @flow
import { chunk, pipe } from 'capture-core-utils';
import { getContext } from '../context';
import { queryProgramsOutline } from './queries';
import {
    storePrograms,
} from './quickStoreOperations';
import { loadRulesCentricMetadata } from './loadRulesCentricMetadata';

const getCachedProgramsOutline = () => {
    const { storageController, storeNames } = getContext();
    return storageController
        .getAll(storeNames.PROGRAMS, {
            project: program => ({
                id: program.id,
                version: program.version,
            }),
        });
};

/**
 * Remove programs from the cache that wasn't retrieved from the api.
 * The reason for doing this is that every program that is available to the user is retrieved from the api and
 * therefore programs in the cache that wasn't retrieved are programs the user don't have access to any more.
 */
const removeUnavailablePrograms = async (apiPrograms, cachedPrograms) => {
    const apiProgramsAsObject = apiPrograms
        .reduce((acc, apiProgram) => {
            acc[apiProgram.id] = apiProgram;
            return acc;
        }, {});

    const unavailableProgramIds = cachedPrograms
        .filter(cachedProgram => !apiProgramsAsObject[cachedProgram.id])
        .map(unavailableProgram => unavailableProgram.id);

    if (unavailableProgramIds.length > 0) {
        const { storageController, storeNames } = getContext();
        await storageController.remove(storeNames.PROGRAMS, unavailableProgramIds);
    }
};

/**
 * Retrieve the program ids for the programs that have an updated program version
 * If the program has an updated version we would like to update the program in the cache
 */
const getStaleProgramIds = (apiPrograms, cachedPrograms) => {
    const cachedProgramsAsObject = cachedPrograms
        .reduce((acc, cachedProgram) => {
            acc[cachedProgram.id] = cachedProgram;
            return acc;
        }, {});

    return apiPrograms
        .filter((program) => {
            const cachedProgram = cachedProgramsAsObject[program.id];
            return !cachedProgram || cachedProgram.version !== program.version;
        })
        .map(program => program.id);
};

/**
 * Update the cache for the program ids passed in.
 * The program ids that are passed in are updated (meaning the version retrieved from the api is different from the one in the cache)
 */
const loadProgramBatch = async (programIds) => {
    const { convertedData: programs = [] } = await storePrograms(programIds);
    await loadRulesCentricMetadata(programIds);
    return programs
        .map(program => ({
            programTrackedEntityAttributes: program.programTrackedEntityAttributes,
            categoryCombo: program.categoryCombo,
            trackedEntityTypeId: program.trackedEntityTypeId,
        }));
};

/**
 * Self executing function to scope the side effect helper functions
 * We're scoping these because they don't directly relate to the actual program loading
 */
const getSideEffects = (() => {
    const getOptionSetsOutline = (() => {
        const getDataElementOptionSets = programStageDataElements =>
            (programStageDataElements || [])
                .map(psda => psda.dataElement && psda.dataElement.optionSet)
                .filter(optionSet => optionSet);

        const getTrackedEntityAttributeOptionSets = programTrackedEntityAttributes =>
            (programTrackedEntityAttributes || [])
                .map(ptea => ptea.trackedEntityAttribute && ptea.trackedEntityAttribute.optionSet)
                .filter(optionSet => optionSet);

        const getProgramOptionSets = (program) => {
            const dataElementOptionSets = (program.programStages || [])
                .flatMap(programStage => getDataElementOptionSets(programStage.programStageDataElements));

            return [
                ...dataElementOptionSets,
                ...getTrackedEntityAttributeOptionSets(program.programTrackedEntityAttributes),
            ];
        };

        return (programsOutline): Array<Object> =>
            programsOutline
                .flatMap(program => getProgramOptionSets(program));
    })();

    const getTrackedEntityAttributeIds = stalePrograms =>
        pipe(
            () => stalePrograms
                .flatMap(program =>
                    (program.programTrackedEntityAttributes || [])
                        .map(programAttribute => programAttribute.trackedEntityAttributeId)
                        .filter(TEAId => TEAId),
                ),
            attributeIds => [...new Set(attributeIds).values()],
        )();

    const getCategories = stalePrograms =>
        pipe(
            () => stalePrograms
                .flatMap(program =>
                    ((program.categoryCombo &&
                    program.categoryCombo.categories) || []),
                ),
            categories => [
                ...new Map(
                    categories.map(ic => [ic.id, ic]),
                ).values(),
            ],
        )();

    const getTrackedEntityTypes = stalePrograms =>
        pipe(
            () => stalePrograms
                .reduce((acc, program) => {
                    program.trackedEntityTypeId && acc.add(program.trackedEntityTypeId);
                    return acc;
                }, new Set()),
            trackedEntityTypeIdSet => [...trackedEntityTypeIdSet.values()],
        )();
    /**
     * Builds the side effects based on the programsOutline (contains some data for all programs) and the stale programs (the programs where the version has changed).
     * The side effects are used later to determine what other metadata to load.
     */
    return (programsOutline, stalePrograms) => ({
        optionSetsOutline: getOptionSetsOutline(programsOutline),
        trackedEntityAttributeIds: getTrackedEntityAttributeIds(stalePrograms),
        categories: getCategories(stalePrograms),
        trackedEntityTypeIds: getTrackedEntityTypes(stalePrograms),
        changesDetected: stalePrograms.length > 0,
    });
})();

export const loadPrograms = async () => {
    const apiProgramsOutline = await queryProgramsOutline();
    const cachedProgramsOutline = await getCachedProgramsOutline();
    await removeUnavailablePrograms(apiProgramsOutline, cachedProgramsOutline);
    const staleProgramIds = getStaleProgramIds(apiProgramsOutline, cachedProgramsOutline);

    const programBatches = chunk(staleProgramIds, 50);
    const programsDataForSideEffects: Array<Object> = (await Promise.all(
        programBatches
            .map(loadProgramBatch),
    )).flat(1);

    return getSideEffects(apiProgramsOutline, programsDataForSideEffects);
};
