import type { ProgramRulesContainer } from '@dhis2/rules-engine-javascript';
import {
    getTrackedEntityAttributeId,
    getDataElementId,
    getProgramId,
    getProgramRuleActions,
    getProgramStageId
} from '../helpers';

const addProgramVariables = (program: any, programRuleVariables: any[]) => {
    program.programRuleVariables = programRuleVariables.map(programRulesVariable => ({
        ...programRulesVariable,
        programId: getProgramId(programRulesVariable),
        dataElementId: getDataElementId(programRulesVariable),
        trackedEntityAttributeId: getTrackedEntityAttributeId(programRulesVariable),
    }));
};

const addProgramRules = (program: any, programRules: any[]) => {
    program.programRules = programRules.map(programRule => ({
        ...programRule,
        programId: getProgramId(programRule),
        programStageId: getProgramStageId(programRule),
        programRuleActions: getProgramRuleActions(programRule.programRuleActions),
    }));
};

export const buildRulesContainer = async ({
    programAPI,
    programRules,
    constants,
    setRulesContainer,
}: {
    programAPI: any;
    programRules: Array<any>;
    constants: Array<any>;
    setRulesContainer: (rulesContainer: ProgramRulesContainer) => void;
}) => {
    const { programRuleVariables } = programAPI;
    const rulesContainer: any = {};

    programRuleVariables && addProgramVariables(rulesContainer, programRuleVariables);
    programRules && addProgramRules(rulesContainer, programRules);
    rulesContainer.constants = constants;

    setRulesContainer(rulesContainer);
};
