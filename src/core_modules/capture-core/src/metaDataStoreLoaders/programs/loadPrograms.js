// @flow
import StorageController from 'capture-core-utils/storage/StorageController';

import chunk from '../../utils/chunk';

import metaProgramsSpec from '../../api/apiSpecifications/metaPrograms.apiSpecification';
import programsSpec from '../../api/apiSpecifications/programs.apiSpecification';
import programRulesSpec from '../../api/apiSpecifications/programRules.apiSpecification';
import programRulesVariablesSpec from '../../api/apiSpecifications/programRulesVariables.apiSpecification';
import programIndicatorsSpec from '../../api/apiSpecifications/programIndicators.apiSpecification';

import getProgramsLoadSpecification from '../../apiToStore/loadSpecifications/getProgramsLoadSpecification';
import getProgramRulesLoadSpecification from '../../apiToStore/loadSpecifications/getProgramRulesLoadSpecification';
import getProgramRulesVariablesLoadSpecification
    from '../../apiToStore/loadSpecifications/getProgramRulesVariablesLoadSpecification';
import getProgramIndicatorsLoadSpecification
    from '../../apiToStore/loadSpecifications/getProgramIndicatorsLoadSpecification';

import programsStoresKeys from './programsStoresKeys';

const batchSize = 50;

async function getMissingPrograms(programs, storageController: StorageController, store: string) {
    if (!programs) {
        return null;
    }

    const storePrograms = {};
    await Promise.all(
        programs.map(
            program => storageController
                .get(store, program.id)
                .then((storeProgram) => { storePrograms[program.id] = storeProgram; }),
        ),
    );

    const missingPrograms = programs.filter((program) => {
        const storeProgram = storePrograms[program.id];
        return !storeProgram || storeProgram.version !== program.version;
    });
    return missingPrograms.length > 0 ? missingPrograms : null;
}

function getPrograms(programs, store, storageController) {
    programsSpec.updateQueryParams({
        filter: `id:in:[${programs.map(program => program.id).toString()}]`,
    });

    const programsLoadSpecification = getProgramsLoadSpecification(store, programsSpec);
    return programsLoadSpecification.load(storageController);
}

function getProgramIndicators(programs, store, storageController) {
    programIndicatorsSpec.updateQueryParams({
        // $FlowSuppress
        filter: `program.id:in:[${programs.map(program => program.id).toString()}]`,
    });

    return getProgramIndicatorsLoadSpecification(store, programIndicatorsSpec).load(storageController);
}

function getProgramRules(programs, store, storageController) {
    programRulesSpec.updateQueryParams({
        // $FlowSuppress
        filter: `program.id:in:[${programs.map(program => program.id).toString()}]`,
    });

    return getProgramRulesLoadSpecification(store, programRulesSpec).load(storageController);
}

function getProgramRulesVariables(programs, store, storageController) {
    programRulesVariablesSpec.updateQueryParams({
        // $FlowSuppress
        filter: `program.id:in:[${programs.map(program => program.id).toString()}]`,
    });

    return getProgramRulesVariablesLoadSpecification(store, programRulesVariablesSpec).load(storageController);
}

// Get option set meta information from api even if the program itself isn't missing.
// Later in the load option set method, the option set version will be used to check if the cache needs updating.
function getOptionSetsMeta(metaPrograms) {
    if (!metaPrograms) {
        return [];
    }

    const getProgramStageOptionsMeta = (programStage) => {
        const prStDes = programStage.programStageDataElements;
        if (!prStDes) {
            return null;
        }
        const programStageOptionSetsMeta = prStDes.reduce((accProgramStageOptionSetsMeta, prStDe) => {
            const optionSet = prStDe.dataElement && prStDe.dataElement.optionSet;
            if (optionSet) {
                accProgramStageOptionSetsMeta.push(optionSet);
            }
            return accProgramStageOptionSetsMeta;
        }, []);

        return programStageOptionSetsMeta.length > 0 ? programStageOptionSetsMeta : null;
    };

    const getProgramStagesOptionsMeta = (programStages) => {
        const programStagesOptionSetsMeta = programStages.reduce((accProgramStagesOptionSetsMeta, programStage) => {
            const programStageOptionSetsMeta = getProgramStageOptionsMeta(programStage);
            if (programStageOptionSetsMeta) {
                accProgramStagesOptionSetsMeta = [...accProgramStagesOptionSetsMeta, ...programStageOptionSetsMeta];
            }
            return accProgramStagesOptionSetsMeta;
        }, []);
        return programStagesOptionSetsMeta.length > 0 ? programStagesOptionSetsMeta : null;
    };

    const optionSetsMeta = metaPrograms.reduce((accOptionSetsMeta, program) => {
        if (program.programStages) {
            const programStages = [...program.programStages.values()];
            const programStagesOptionSetsMeta = getProgramStagesOptionsMeta(programStages);
            if (programStagesOptionSetsMeta) {
                accOptionSetsMeta = [...accOptionSetsMeta, ...programStagesOptionSetsMeta];
            }
        }
        return accOptionSetsMeta;
    }, []);

    return optionSetsMeta;
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

export default async function loadProgramsData(storageController: StorageController, stores: Object) {
    const metaPrograms = await metaProgramsSpec.get();
    const optionSetsMeta = getOptionSetsMeta(metaPrograms);
    const missingPrograms = await getMissingPrograms(
        metaPrograms,
        storageController,
        stores[programsStoresKeys.PROGRAMS],
    );

    const programBatches = chunk(missingPrograms, batchSize);
    const programGroups = await Promise.all(
        programBatches.map(
            batch =>
                getPrograms(batch, stores[programsStoresKeys.PROGRAMS], storageController)
                    .then(programs =>
                        getProgramRules(programs, stores[programsStoresKeys.PROGRAM_RULES], storageController)
                            .then(() => getProgramRulesVariables(programs, stores[programsStoresKeys.PROGRAM_RULES_VARIABLES], storageController))
                            .then(() => getProgramIndicators(programs, stores[programsStoresKeys.PROGRAM_INDICATORS], storageController))
                            .then(() => programs),
                    ),
        ),
    );

    const missingProgramsWithData = programGroups
        .filter(programs => programs)
        // $FlowFixMe
        .reduce((accPrograms, programs) => ([...accPrograms, ...programs]), []);

    return { optionSetsMeta, trackedEntityAttributeIds: getTrackedEntityAttributeIds(missingProgramsWithData) };
}
