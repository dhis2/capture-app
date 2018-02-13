// @flow
import chunk from '../../utils/chunk';

import metaProgramsSpec from '../../api/apiSpecifications/metaPrograms.apiSpecification';
import programsSpec from '../../api/apiSpecifications/programs.apiSpecification';
import programRulesSpec from '../../api/apiSpecifications/programRules.apiSpecification';
import programRulesVariablesSpec from '../../api/apiSpecifications/programRulesVariables.apiSpecification';
import programIndicatorsSpec from '../../api/apiSpecifications/programIndicators.apiSpecification';

import getProgramsLoadSpecification from '../../apiToStore/loadSpecifications/getProgramsLoadSpecification';
import getProgramRulesLoadSpecification from '../../apiToStore/loadSpecifications/getProgramRulesLoadSpecification';
import getProgramRulesVariablesLoadSpecification from '../../apiToStore/loadSpecifications/getProgramRulesVariablesLoadSpecification';
import getProgramIndicatorsLoadSpecification from '../../apiToStore/loadSpecifications/getProgramIndicatorsLoadSpecification';


import StorageContainer from '../../storage/StorageContainer';
import programsStoresKeys from './programsStoresKeys';

const batchSize = 50;

async function getMissingPrograms(programs, storageContainer: StorageContainer, store: string) {
    if (!programs) {
        return null;
    }

    const storePrograms = {};
    await Promise.all(
        programs.map(
            program => storageContainer
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

function getPrograms(programs, store, storageContainer) {
    programsSpec.updateQueryParams({
        filter: `id:in:[${programs.map(program => program.id).toString()}]`,
    });

    const programsLoadSpecification = getProgramsLoadSpecification(store, programsSpec);
    return programsLoadSpecification.load(storageContainer);
}

function getProgramIndicators(programs, store, storageContainer) {
    programIndicatorsSpec.updateQueryParams({
        // $FlowSuppress
        filter: `program.id:in:[${programs.map(program => program.id).toString()}]`,
    });

    return getProgramIndicatorsLoadSpecification(store, programIndicatorsSpec).load(storageContainer);
}

function getProgramRules(programs, store, storageContainer) {
    programRulesSpec.updateQueryParams({
        // $FlowSuppress
        filter: `program.id:in:[${programs.map(program => program.id).toString()}]`,
    });

    return getProgramRulesLoadSpecification(store, programRulesSpec).load(storageContainer);
}

function getProgramRulesVariables(programs, store, storageContainer) {
    programRulesVariablesSpec.updateQueryParams({
        // $FlowSuppress
        filter: `program.id:in:[${programs.map(program => program.id).toString()}]`,
    });

    return getProgramRulesVariablesLoadSpecification(store, programRulesVariablesSpec).load(storageContainer);
}

async function getOptionSetIdsToRetrieve(metaPrograms, optionSetStore: string, storageContainer: StorageContainer) {
    let optionSetIds = [];

    if (metaPrograms) {
        const includeOptionSetIdIfApplicable = (metaOptionSet, storeOptionSet) => {
            if ((!storeOptionSet || storeOptionSet.version !== metaOptionSet.version) && (!optionSetIds.includes(metaOptionSet.id))) {
                return metaOptionSet.id;
            }
            return null;
        };

        const getPrStDesPromises = (prStDes) => {
            const prStDesPromises = prStDes.reduce((accPrStDesPromises, prStDe) => {
                if (prStDe.dataElement && prStDe.dataElement.optionSet && prStDe.dataElement.optionSet.id) {
                    const optionSet = prStDe.dataElement.optionSet;
                    const resolvedPromise = storageContainer
                        .get(optionSetStore, optionSet.id)
                        .then(storeData => includeOptionSetIdIfApplicable(optionSet, storeData));

                    accPrStDesPromises.push(resolvedPromise);
                }
                return accPrStDesPromises;
            }, []);
            return prStDesPromises;
        };

        const getProgramStagesPromises = (programStages) => {
            const programStagesPromises = programStages.reduce((accProgramStagesPromises, programStage) => {
                if (programStage.programStageDataElements) {
                    const prStDes = programStage.programStageDataElements;
                    const prStDesPromises = getPrStDesPromises(prStDes);
                    return [...accProgramStagesPromises, ...prStDesPromises];
                }
                return accProgramStagesPromises;
            }, []);

            return programStagesPromises;
        };

        const programsPromises = metaPrograms.reduce((accProgramsPromises, program) => {
            if (program.programStages) {
                const programStages = [...program.programStages.values()];
                const programStagesPromises = getProgramStagesPromises(programStages);
                return [...accProgramsPromises, ...programStagesPromises];
            }
            return accProgramsPromises;
        }, []);

        const missingOptionSetIdsAsArray = await Promise.all(programsPromises);
        optionSetIds = missingOptionSetIdsAsArray.filter(optionSetId => !!optionSetId);
    }
    return optionSetIds;
}

export default async function getProgramsData(storageContainer: StorageContainer, stores: Object) {
    const metaPrograms = await metaProgramsSpec.get();
    const missingOptionSetIdsFromPrograms = await getOptionSetIdsToRetrieve(metaPrograms, stores[programsStoresKeys.OPTION_SETS], storageContainer);
    const missingPrograms = await getMissingPrograms(metaPrograms, storageContainer, stores[programsStoresKeys.PROGRAMS]);

    const programBatches = chunk(missingPrograms, batchSize);

    await Promise.all(
        programBatches.map(
            batch =>
                getPrograms(batch, stores[programsStoresKeys.PROGRAMS], storageContainer)
                    .then(programs => getProgramRules(programs, stores[programsStoresKeys.PROGRAM_RULES], storageContainer)
                        .then(() => getProgramRulesVariables(programs, stores[programsStoresKeys.PROGRAM_RULES_VARIABLES], storageContainer))
                        .then(() => getProgramIndicators(programs, stores[programsStoresKeys.PROGRAM_INDICATORS], storageContainer))),
        ),
    );


    return { missingPrograms, missingOptionSetIdsFromPrograms };
}
