// @flow
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


import StorageController from '../../storage/StorageController';
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

async function getOptionSetIdsToRetrieve(metaPrograms, optionSetStore: string, storageController: StorageController) {
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
                    const resolvedPromise = storageController
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

function getCategories(missingPrograms) {
    return missingPrograms
        ? missingPrograms.reduce((accCategories, program) => {
            const programCategories = program.categoryCombo &&
                program.categoryCombo.categories;
            return programCategories ? [...accCategories, ...programCategories] : [];
        }, []) : [];
}

export default async function getProgramsData(storageController: StorageController, stores: Object) {
    const metaPrograms = await metaProgramsSpec.get();
    const missingOptionSetIdsFromPrograms = await getOptionSetIdsToRetrieve(metaPrograms, stores[programsStoresKeys.OPTION_SETS], storageController);
    const missingPrograms = await getMissingPrograms(metaPrograms, storageController, stores[programsStoresKeys.PROGRAMS]);

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


    return {
        missingPrograms,
        missingOptionSetIdsFromPrograms,
        categoryIds: getCategories(missingProgramsWithData),
    };
}
