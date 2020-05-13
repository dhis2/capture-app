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

const removeUnavailablePrograms = async (apiPrograms, cachePrograms) => {
    const apiProgramsObject = apiPrograms
        .reduce((acc, apiProgram) => {
            acc[apiProgram.id] = apiProgram;
            return acc;
        }, {});

    const unavailableProgramIds = cachePrograms
        .filter(cacheProgram => !apiProgramsObject[cacheProgram.id])
        .map(unavailableProgram => unavailableProgram.id);

    if (unavailableProgramIds.length > 0) {
        const { storageController, storeNames } = getContext();
        await storageController.remove(storeNames.PROGRAMS, unavailableProgramIds);
    }
};

const getStaleProgramIds = (apiPrograms, cachePrograms) => {
    const cacheProgramsAsObject = cachePrograms
        .reduce((acc, cacheProgram) => {
            acc[cacheProgram.id] = cacheProgram;
            return acc;
        }, {});

    return apiPrograms
        .filter((program) => {
            const cachedProgram = cacheProgramsAsObject[program.id];
            return !cachedProgram || cachedProgram.version !== program.version;
        })
        .map(program => program.id);
};

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

        return programsOutline =>
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
