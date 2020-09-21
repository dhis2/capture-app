// @flow
import type StorageController from 'capture-core-utils/storage/StorageController';
import type { ProgramRule, ProgramRuleVariable } from '../../rules/engine';
import { ProgramFactory } from './factory';
import type {
    Program,
    TrackedEntityType,
} from '../../metaData';
import { programCollection } from '../../metaDataMemoryStores';
import getRulesAndVariablesFromProgramIndicators from './getRulesAndVariablesFromIndicators';
import { getUserStorageController } from '../../storageControllers';
import { userStores as stores } from '../../storageControllers/stores';

import type {
    CachedProgram,
    CachedOptionSet,
    CachedRelationshipType,
    CachedTrackedEntityAttribute,
    CachedTrackedEntityType,
    CachedCategory,
} from '../../storageControllers/cache.types';
import type { CachedProgramIndicator } from './getRulesAndVariablesFromIndicators';


function getPrograms(storageController: typeof StorageController, storeName: string): Promise<Array<Object>> {
    return storageController.getAll(storeName);
}

function getProgramRulesVariables(storageController: typeof StorageController, storeName: string): Promise<Array<Object>> {
    return storageController.getAll(storeName);
}

function getProgramRules(storageController: typeof StorageController, storeName: string): Promise<Array<Object>> {
    return storageController.getAll(storeName);
}

function getProgramIndicators(storageController: typeof StorageController, storeName: string): Promise<Array<Object>> {
    return storageController.getAll(storeName);
}

function getRelationshipTypes(storageController: typeof StorageController, storeName: string): Promise<Array<Object>> {
    return storageController.getAll(storeName);
}

function getCategories(
    storageController: typeof StorageController,
    storeName: string,
): Promise<{[categoryId: string]: CachedCategory}> {
    return storageController.getAll(storeName)
        .then(categoryArray => categoryArray.reduce((accCategories, category) => {
            accCategories[category.id] = category;
            return accCategories;
        }, {}));
}

async function getBuilderPrerequisites() {
    const storageController = getUserStorageController();

    const cachedProgramsPromise = getPrograms(storageController, stores.PROGRAMS);
    const cachedProgramRulesVariables = getProgramRulesVariables(storageController, stores.PROGRAM_RULES_VARIABLES);
    const cachedProgramRules = getProgramRules(storageController, stores.PROGRAM_RULES);
    const cachedProgramIndicatorsPromise = getProgramIndicators(storageController, stores.PROGRAM_INDICATORS);
    const cachedRelationshipTypesPromise = getRelationshipTypes(storageController, stores.RELATIONSHIP_TYPES);
    const cachedCategoriesPromise = getCategories(storageController, stores.CATEGORIES);

    const values =
        await Promise.all([
            cachedProgramsPromise,
            cachedProgramRulesVariables,
            cachedProgramRules,
            cachedProgramIndicatorsPromise,
            cachedRelationshipTypesPromise,
            cachedCategoriesPromise,
        ]);
    return values;
}

function addProgramVariables(d2ProgramRulesVariables: Array<ProgramRuleVariable>) {
    const rulesVariablesByProgram = d2ProgramRulesVariables.reduce((accRulesVariablesByProgram, d2RuleVariable) => {
        const ruleVariableProgramId = d2RuleVariable.programId;
        accRulesVariablesByProgram[ruleVariableProgramId] = accRulesVariablesByProgram[ruleVariableProgramId] || [];
        accRulesVariablesByProgram[ruleVariableProgramId].push(d2RuleVariable);
        return accRulesVariablesByProgram;
    }, {});

    Object.keys(rulesVariablesByProgram).forEach((programKey) => {
        const programRulesVariables = rulesVariablesByProgram[programKey];
        const program = programCollection.get(programKey);
        if (program) {
            program.programRuleVariables = programRulesVariables;
        }
    });
}

function addProgramRules(d2ProgramRules: Array<ProgramRule>) {
    const rulesByProgram = d2ProgramRules.reduce((accRulesByProgram, d2Rule) => {
        const ruleProgramId = d2Rule.programId;
        accRulesByProgram[ruleProgramId] = accRulesByProgram[ruleProgramId] || [];
        accRulesByProgram[ruleProgramId].push(d2Rule);
        return accRulesByProgram;
    }, {});

    Object.keys(rulesByProgram).forEach((programKey) => {
        const programRules = rulesByProgram[programKey];
        const program = programCollection.get(programKey);
        if (program) {
            const mainRules = programRules
                .filter(rule => !rule.programStageId);

            const rulesByStage = programRules
                .filter(rule => rule.programStageId)
                .reduce((accRulesByStage, programRule) => {
                    accRulesByStage[programRule.programStageId] = accRulesByStage[programRule.programStageId] || [];
                    accRulesByStage[programRule.programStageId].push(programRule);
                    return accRulesByStage;
                }, {});

            program.programRules = mainRules;
            Object
                .keys(rulesByStage)
                .forEach((stageKey) => {
                    const rulesForStage = rulesByStage[stageKey];
                    const programStage = program.getStage(stageKey);
                    if (programStage) {
                        // $FlowFixMe[prop-missing] automated comment
                        programStage.programRules = rulesForStage;
                    }
                });
        }
    });
}

function addRulesAndVariablesFromProgramIndicators(cachedProgramIndicators: Array<CachedProgramIndicator>) {
    const indicatorsByProgram = cachedProgramIndicators.reduce((accIndicatorsByProgram, indicator) => {
        const programId = indicator.programId;
        accIndicatorsByProgram[programId] = accIndicatorsByProgram[programId] || [];
        accIndicatorsByProgram[programId].push(indicator);
        return accIndicatorsByProgram;
    }, {});

    Object.keys(indicatorsByProgram).forEach((programKey) => {
        const indicators = indicatorsByProgram[programKey];
        const program = programCollection.get(programKey);
        if (program) {
            const { rules, variables } = getRulesAndVariablesFromProgramIndicators(indicators, programKey);
            rules && program.addProgramRules(rules);
            variables && program.addProgramRuleVariables(variables);
        }
    });
}

function sortPrograms(programs: Array<Program>) {
    programs.sort((a, b) => {
        if (a.name === b.name) {
            return 0;
        } else if (a.name > b.name) {
            return 1;
        }
        return -1;
    });
    return programs;
}

async function getBuiltPrograms(
    cachedPrograms: Array<CachedProgram>,
    cachedOptionSets: Map<string, CachedOptionSet>,
    cachedRelationshipTypes: Array<CachedRelationshipType>,
    cachedTrackedEntityAttributes: Map<string, CachedTrackedEntityAttribute>,
    cachedTrackedEntityTypes: Map<string, CachedTrackedEntityType>,
    cachedCategories: {[categoryId: string]: CachedCategory},
    trackedEntityTypeCollection: Map<string, TrackedEntityType>,
    locale: ?string,
) {
    if (cachedPrograms.length <= 0) {
        return [];
    }

    const programFactory = new ProgramFactory(
        cachedOptionSets,
        cachedRelationshipTypes,
        cachedTrackedEntityAttributes,
        cachedTrackedEntityTypes,
        cachedCategories,
        trackedEntityTypeCollection,
        locale,
    );

    const promisePrograms = cachedPrograms.map(async (cachedProgram) => {
        // $FlowFixMe[incompatible-call] automated comment
        const program = await programFactory.build(cachedProgram);
        return program;
    });
    const programs = await Promise.all(promisePrograms);
    return programs;
}

function postProcessPrograms(
    programs: Array<Program>,
    cachedProgramRulesVariables: ?Array<ProgramRuleVariable>,
    cachedProgramRules: ?Array<ProgramRule>,
    cachedProgramIndicators: ?Array<CachedProgramIndicator>,
) {
    sortPrograms(programs)
        .forEach((program) => {
            programCollection.set(program.id, program);
        });

    if (cachedProgramRulesVariables) {
        addProgramVariables(cachedProgramRulesVariables);
    }

    if (cachedProgramRules) {
        addProgramRules(cachedProgramRules);
    }

    if (cachedProgramIndicators) {
        addRulesAndVariablesFromProgramIndicators(cachedProgramIndicators);
    }
}

export default async function buildPrograms(
    locale: string,
    cachedOptionSets: Map<string, CachedOptionSet>,
    cachedTrackedEntityAttributes: Map<string, CachedTrackedEntityAttribute>,
    cachedTrackedEntityTypes: Map<string, CachedTrackedEntityType>,
    trackedEntityTypeCollection: Map<string, TrackedEntityType>,
) {
    const [
        cachedPrograms,
        cachedProgramRulesVariables,
        cachedProgramRules,
        cachedProgramIndicators,
        cachedRelationshipTypes,
        cachedCategories,
    ] =
        await getBuilderPrerequisites();

    const programs = await getBuiltPrograms(
        cachedPrograms,
        cachedOptionSets,
        cachedRelationshipTypes,
        cachedTrackedEntityAttributes,
        cachedTrackedEntityTypes,
        cachedCategories,
        trackedEntityTypeCollection,
        locale,
    );

    postProcessPrograms(
        programs,
        cachedProgramRulesVariables,
        cachedProgramRules,
        cachedProgramIndicators,
    );
}
