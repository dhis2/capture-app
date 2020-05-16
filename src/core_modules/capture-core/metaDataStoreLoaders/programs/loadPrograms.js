// @flow
import { chunk } from 'capture-core-utils';
import { queryProgramsOutline } from './queries';
import {
    storePrograms,
    storeProgramRules,
    storeProgramRulesVariables,
    storeProgramIndicators,
} from './quickStoreOperations';
import { getContext } from '../context';

async function getMissingPrograms(programsOutline) {
    const cachedPrograms = {};
    const { storageController, storeNames } = getContext();
    await Promise.all(
        programsOutline.map(
            program => storageController
                .get(storeNames.PROGRAMS, program.id)
                .then((cachedProgram) => { cachedPrograms[program.id] = cachedProgram; }),
        ),
    );

    const missingPrograms = programsOutline.filter((program) => {
        const cachedProgram = cachedPrograms[program.id];
        return !cachedProgram || cachedProgram.version !== program.version;
    });
    return missingPrograms.length > 0 ? missingPrograms : null;
}

// Get option set meta information from api even if the program itself isn't missing.
// Later in the load option set method, the option set version will be used to check if the cache needs updating.
function getOptionSetsOutline(programsOutline) {
    const getProgramStageOptionSets = (programStage) => {
        const programStageDataElements = programStage.programStageDataElements || [];
        return programStageDataElements.reduce((accProgramStageOptionSets, programStageDataElement) => {
            const optionSet = programStageDataElement.dataElement && programStageDataElement.dataElement.optionSet;
            if (optionSet) {
                accProgramStageOptionSets.push(optionSet);
            }
            return accProgramStageOptionSets;
        }, []);
    };

    const getProgramOptionSets = (program) => {
        const programStages = program.programStages || [];
        return programStages.reduce((accProgramStagesOptionSets, programStage) => [
            ...accProgramStagesOptionSets, ...getProgramStageOptionSets(programStage),
        ], []);
    };

    return programsOutline.reduce((accOptionSets, program) => [
        ...accOptionSets, ...getProgramOptionSets(program),
    ], []);
}

function getTrackedEntityAttributeIds(missingPrograms) {
    return missingPrograms
        ? missingPrograms.reduce((accAttributeIds, program) => {
            if (program.programTrackedEntityAttributes) {
                const attributeIds =
                    program.programTrackedEntityAttributes
                        .map(programAttribute => programAttribute.trackedEntityAttributeId)
                        .filter(TEAId => TEAId);

                return [...accAttributeIds, ...attributeIds];
            }
            return accAttributeIds;
        }, [])
        : [];
}

function getCategories(missingPrograms) {
    return missingPrograms
        ? missingPrograms.reduce((accCategories, program) => {
            const programCategories = program.categoryCombo &&
                program.categoryCombo.categories;
            return programCategories ? [...accCategories, ...programCategories] : [];
        }, []) : [];
}

async function loadProgramBatch(programBatch) {
    const programIds = programBatch.map(program => program.id);
    const { convertedData: programs } = await storePrograms(programIds);
    await storeProgramRules(programIds);
    await storeProgramRulesVariables(programIds);
    await storeProgramIndicators(programIds);
    return programs;
}

export async function loadPrograms() {
    const programsOutline = await queryProgramsOutline();
    const optionSetsOutline = getOptionSetsOutline(programsOutline);
    const missingPrograms = await getMissingPrograms(programsOutline);

    const programBatches = chunk(missingPrograms, 50);
    const programGroups = await Promise.all(
        programBatches
            .map(loadProgramBatch),
    );

    const missingProgramsWithData = programGroups
        .filter(programs => programs)
        // $FlowFixMe
        .reduce((accPrograms, programs) => ([...accPrograms, ...programs]), []);
    return {
        optionSetsOutline,
        trackedEntityAttributeIds: getTrackedEntityAttributeIds(missingProgramsWithData),
        categoryIds: getCategories(missingProgramsWithData),
    };
}
