// @flow
/* eslint-disable complexity */
import programCollection from '../../metaDataMemoryStores/programCollection/programCollection';
import Program from '../../metaData/Program/Program';
import Icon from '../../metaData/Icon/Icon';

import EventProgram from '../../metaData/Program/EventProgram';
import TrackerProgram from '../../metaData/Program/TrackerProgram';
import CategoryCombination from '../../metaData/CategoryCombinations/CategoryCombination';
import Category from '../../metaData/CategoryCombinations/Category';

import getProgramIconAsync from './getProgramIcon';

import getRulesAndVariablesFromProgramIndicators from './getRulesAndVariablesFromIndicators';
import type { CachedProgramIndicator } from './getRulesAndVariablesFromIndicators';
import type { ProgramRule, ProgramRuleVariable } from '../../RulesEngine/rulesEngine.types';
import buildSearchGroups from './searchGroupFactory';
import buildStage from './programStageFactory';

import type {
    CachedStyle,
    CachedProgramStage,
    CachedCategory,
    CachedCategoryCombo,
    CachedProgram,
    CachedOptionSet,
    CachedRelationshipType,

} from './cache.types';

let currentLocale: ?string;
let currentD2OptionSets: ?Array<CachedOptionSet>;
let currentD2RelationshipTypes: ?Array<CachedRelationshipType>;

function buildCategories(cachedCategories: Array<CachedCategory>) {
    return cachedCategories
        .map(cachedCategory =>
            new Category((_this) => {
                _this.id = cachedCategory.id;
                _this.name = cachedCategory.displayName;
                _this.categoryOptions = cachedCategory.categoryOptions ? cachedCategory.categoryOptions.map(cachedOption => ({
                    id: cachedOption.id,
                    name: cachedOption.displayName,
                })) : null;
            }),
        );
}

function buildCategoriCombination(cachedCategoriCombination: ?CachedCategoryCombo) {
    if (!(
        cachedCategoriCombination &&
        !cachedCategoriCombination.isDefault &&
        cachedCategoriCombination.categories &&
        cachedCategoriCombination.categories.length > 0
    )) {
        return null;
    }

    return new CategoryCombination((_this) => {
        // $FlowSuppress
        _this.name = cachedCategoriCombination.displayName;
        // $FlowSuppress
        _this.id = cachedCategoriCombination.id;
        // $FlowSuppress
        _this.categories = buildCategories(cachedCategoriCombination.categories);
    });
}

async function buildProgramIcon(cachedStyle: CachedStyle = {}) {
    const icon = new Icon();
    icon.color = cachedStyle.color || '#e0e0e0';
    icon.data = await getProgramIconAsync(cachedStyle.icon);

    return icon;
}

async function buildProgram(d2Program: CachedProgram) {
    let program;
    if (d2Program.programType === 'WITHOUT_REGISTRATION') {
        program = new EventProgram((_this) => {
            _this.id = d2Program.id;
            _this.access = d2Program.access;
            _this.name = d2Program.displayName;
            _this.shortName = d2Program.displayShortName;
            _this.organisationUnits = d2Program.organisationUnits;
            _this.categoryCombination = buildCategoriCombination(d2Program.categoryCombo);
        });
        const d2Stage = d2Program.programStages && d2Program.programStages[0];
        program.stage = await buildStage(d2Stage, currentD2OptionSets, currentD2RelationshipTypes, program.id, currentLocale);
    } else {
        program = new TrackerProgram((_this) => {
            _this.id = d2Program.id;
            _this.name = d2Program.displayName;
            _this.shortName = d2Program.displayShortName;
            // $FlowFixMe
            _this.trackedEntityType = d2Program.trackedEntityType;
        });

        program.searchGroups = await buildSearchGroups(d2Program, currentLocale);
        await d2Program.programStages.asyncForEach(async (d2ProgramStage: CachedProgramStage) => {
            program.addStage(await buildStage(d2ProgramStage, currentD2OptionSets, currentD2RelationshipTypes, program.id, currentLocale));
        });
    }
    program.icon = await buildProgramIcon(d2Program.style);

    return program;
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

export default async function buildProgramCollection(
    cachedPrograms: ?Array<CachedProgram>,
    cachedOptionSets: ?Array<CachedOptionSet>,
    cachedProgramRulesVariables: ?Array<ProgramRuleVariable>,
    cachedProgramRules: ?Array<ProgramRule>,
    cachedProgramIndicators: ?Array<CachedProgramIndicator>,
    cachedRelationshipTypes: ?Array<CachedRelationshipType>,
    locale: ?string) {
    currentLocale = locale;
    currentD2OptionSets = cachedOptionSets;
    currentD2RelationshipTypes = cachedRelationshipTypes;

    if (cachedPrograms) {
        const promisePrograms = cachedPrograms.map(async (d2Program) => {
            const program = await buildProgram(d2Program);
            return program;
        });
        const programs = await Promise.all(promisePrograms);

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
}
