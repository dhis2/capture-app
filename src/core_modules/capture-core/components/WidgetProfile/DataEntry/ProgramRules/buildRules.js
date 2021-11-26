// @flow
import { getTrackedEntityAttributeId, getProgramId, getProgramRuleActions } from '../FormFoundation';
import { buildFormFoundation } from '../FormFoundation/RenderFoundation';
import { TrackerProgram } from '../../../../metaData';
import { getRulesAndVariablesFromProgramIndicators } from '../../../../metaDataMemoryStoreBuilders/programs/getRulesAndVariablesFromIndicators';

const addProgramVariables = (program, programRuleVariables) => {
    program.programRuleVariables = programRuleVariables.map(programRulesVariable => ({
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
            accRulesByStage[programRule.programStageId] = accRulesByStage[programRule.programStageId] || [];
            accRulesByStage[programRule.programStageId].push(programRule);
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
        program.programRuleVariables = [...program.programRuleVariables, ...variables];
    }
    if (rules) {
        program.programRules = [...program.programRules, ...rules];
    }
};

export const buildRules = async ({
    programRules,
    programAPI,
    setProgram,
}: {
    programRules: any,
    programAPI: any,
    setProgram: (enrollment: any) => void,
}) => {
    const formFoundation = await buildFormFoundation(programAPI);

    const program = new TrackerProgram((trackerProgram) => {
        trackerProgram.id = programAPI.id;
        trackerProgram.access = programAPI.access;
        trackerProgram.name = programAPI.displayName;
        trackerProgram.shortName = programAPI.displayShortName;
        trackerProgram.trackedEntityType = programAPI.trackedEntityType;
        trackerProgram.enrollment = { enrollmentForm: formFoundation };
    });

    const { programRuleVariables, programIndicators } = programAPI;
    programRuleVariables && addProgramVariables(program, programRuleVariables);
    programRules && addProgramRules(program, programRules);
    programIndicators && addRulesAndVariablesFromProgramIndicators(program, programIndicators);

    setProgram(program);
};
