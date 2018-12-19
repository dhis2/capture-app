// @flow
import StorageController from 'capture-core-utils/storage/StorageController';
import { ProgramFactory } from './factory';
import {
    Program,
    TrackedEntityType,
} from '../../metaData';
import { programCollection } from '../../metaDataMemoryStores';
import getRulesAndVariablesFromProgramIndicators from './getRulesAndVariablesFromIndicators';
import { getUserStorageController } from '../../storageControllers';

import type {
    CachedProgram,
    CachedOptionSet,
    CachedRelationshipType,
    CachedTrackedEntityAttribute,
} from '../../storageControllers/cache.types';
import type { CachedProgramIndicator } from './getRulesAndVariablesFromIndicators';
import type { ProgramRule, ProgramRuleVariable } from '../../RulesEngine/rulesEngine.types';


function getPrograms(storageController: StorageController, storeName: string): Promise<Array<Object>> {
    return storageController.getAll(storeName);
}

function getProgramRulesVariables(storageController: StorageController, storeName: string): Promise<Array<Object>> {
    return storageController.getAll(storeName);
}

function getProgramRules(storageController: StorageController, storeName: string): Promise<Array<Object>> {
    return storageController.getAll(storeName);
}

function getProgramIndicators(storageController: StorageController, storeName: string): Promise<Array<Object>> {
    return storageController.getAll(storeName);
}

function getRelationshipTypes(storageController: StorageController, storeName: string): Promise<Array<Object>> {
    return storageController.getAll(storeName);
}

async function getBuilderPrerequisites(...storeNames: Array<string>) {
    const storageController = getUserStorageController();

    const cachedProgramsPromise = getPrograms(storageController, storeNames[0]);
    const cachedProgramRulesVariables = getProgramRulesVariables(storageController, storeNames[1]);
    const cachedProgramRules = getProgramRules(storageController, storeNames[2]);
    const cachedProgramIndicatorsPromise = getProgramIndicators(storageController, storeNames[3]);
    const cachedRelationshipTypesPromise = getRelationshipTypes(storageController, storeNames[4]);

    const values =
        await Promise.all([
            cachedProgramsPromise,
            cachedProgramRulesVariables,
            cachedProgramRules,
            cachedProgramIndicatorsPromise,
            cachedRelationshipTypesPromise,
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
        trackedEntityTypeCollection,
        locale,
    );

    const promisePrograms = cachedPrograms.map(async (cachedProgram) => {
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
    programStoreName: string,
    programRulesVariablesStoreName: string,
    programRulesStoreName: string,
    programIndicatorsStoreName: string,
    relationshipTypesStoreName: string,
    cachedOptionSets: Map<string, CachedOptionSet>,
    cachedTrackedEntityAttributes: Map<string, CachedTrackedEntityAttribute>,
    trackedEntityTypeCollection: Map<string, TrackedEntityType>,
) {
    const [
        cachedPrograms,
        cachedProgramRulesVariables,
        cachedProgramRules,
        cachedProgramIndicators,
        cachedRelationshipTypes,
    ] =
        await getBuilderPrerequisites(
            programStoreName,
            programRulesVariablesStoreName,
            programRulesStoreName,
            programIndicatorsStoreName,
            relationshipTypesStoreName,
        );

    const programs = await getBuiltPrograms(
        cachedPrograms,
        cachedOptionSets,
        cachedRelationshipTypes,
        cachedTrackedEntityAttributes,
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
