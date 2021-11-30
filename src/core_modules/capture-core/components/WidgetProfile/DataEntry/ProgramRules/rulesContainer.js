// @flow
import type { ProgramRulesContainer } from 'capture-core-utils/rulesEngine';
import { getTrackedEntityAttributeId, getProgramId, getProgramRuleActions } from '../FormFoundation';
import { getRulesAndVariablesFromProgramIndicators } from '../../../../metaDataMemoryStoreBuilders/programs/getRulesAndVariablesFromIndicators';

const addProgramVariables = (program, programRuleVariables) => {
    program.programRulesVariables = programRuleVariables
        .filter(programRulesVariable => programRulesVariable.programRuleVariableSourceType === 'TEI_ATTRIBUTE')
        .map(programRulesVariable => ({
            ...programRulesVariable,
            programId: getProgramId(programRulesVariable),
            trackedEntityAttributeId: getTrackedEntityAttributeId(programRulesVariable),
        }));
};

const addProgramRules = (program, programRules) => {
    const filteredProgramRules = programRules.map(programRule => ({
        ...programRule,
        programId: getProgramId(programRule),
        programRuleActions: getProgramRuleActions(programRule.programRuleActions),
    }));
    const mainRules = filteredProgramRules.filter(rule => !rule.programStageId);

    const rulesByStage = filteredProgramRules
        .filter(rule => rule.programStageId)
        .reduce((accRulesByStage, programRule) => {
            const programStageId = programRule.programStageId || '';
            accRulesByStage[programStageId] = accRulesByStage[programStageId] || [];
            accRulesByStage[programStageId].push(programRule);
            return accRulesByStage;
        }, {});

    program.programRules = mainRules;
    Object.keys(rulesByStage).forEach((stageKey) => {
        const rulesForStage = rulesByStage[stageKey];
        const programStage = program.getStage(stageKey);
        if (programStage) {
            // $FlowFixMe[prop-missing] automated comment
            programStage.programRules = rulesForStage;
        }
    });
};

const addRulesAndVariablesFromProgramIndicators = (program, programIndicators) => {
    const indicators = programIndicators.map(programIndicator => ({
        ...programIndicator,
        programId: getProgramId(programIndicator),
    }));
    const { rules, variables } = getRulesAndVariablesFromProgramIndicators(indicators, program.id);

    if (variables) {
        program.programRulesVariables = [...program.programRulesVariables, ...variables];
    }
    if (rules) {
        program.programRules = [...program.programRules, ...rules];
    }
};

export const buildRulesContainer = async ({
    programAPI,
    programRules,
    constants,
    setRulesContainer,
}: {
    programAPI: any,
    programRules: Array<any>,
    constants: Array<any>,
    setRulesContainer: (rulesContainer: ProgramRulesContainer) => void,
}) => {
    const { programRuleVariables, programIndicators } = programAPI;
    const rulesContainer = {};

    programRuleVariables && addProgramVariables(rulesContainer, programRuleVariables);
    programRules && addProgramRules(rulesContainer, programRules);
    programIndicators && addRulesAndVariablesFromProgramIndicators(rulesContainer, programIndicators);

    rulesContainer.constants = constants;

    setRulesContainer(rulesContainer);
};
