// @flow
import type { ProgramRulesContainer } from '@dhis2/rules-engine-javascript';
import { getTrackedEntityAttributeId, getDataElementId, getProgramId, getProgramRuleActions, getProgramStageId } from '../helpers';
import { getRulesAndVariablesFromProgramIndicators } from '../../../../metaDataMemoryStoreBuilders/programs/getRulesAndVariablesFromIndicators';

const addProgramVariables = (program, programRuleVariables) => {
    program.programRuleVariables = programRuleVariables.map(programRulesVariable => ({
        ...programRulesVariable,
        programId: getProgramId(programRulesVariable),
        dataElementId: getDataElementId(programRulesVariable),
        trackedEntityAttributeId: getTrackedEntityAttributeId(programRulesVariable),
    }));
};

const addProgramRules = (program, programRules) => {
    program.programRules = programRules.map(programRule => ({
        ...programRule,
        programId: getProgramId(programRule),
        programStageId: getProgramStageId(programRule),
        programRuleActions: getProgramRuleActions(programRule.programRuleActions),
    }));
};

const addRulesAndVariablesFromProgramIndicators = (program, programIndicators) => {
    const indicators = programIndicators.map(programIndicator => ({
        ...programIndicator,
        programId: getProgramId(programIndicator),
    }));
    const { rules, variables } = getRulesAndVariablesFromProgramIndicators(indicators, program.id);

    if (variables) {
        program.programRuleVariables = [...program.programRuleVariables, ...variables];
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
