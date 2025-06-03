import log from 'loglevel';
import { errorCreator } from 'capture-core-utils';
import type { ProgramRulesContainer } from '../../../../rules/RuleEngine';
import { getTrackedEntityAttributeId, getDataElementId, getProgramId, getProgramRuleActions, getProgramStageId } from '../helpers';
import { getRulesAndVariablesFromProgramIndicators } from '../../../../metaDataMemoryStoreBuilders/programs/getRulesAndVariablesFromIndicators';
import type { BuildRulesContainerParams } from '../types/dataEntry.types';

const addProgramVariables = (program: any, programRuleVariables: any[]): void => {
    program.programRuleVariables = programRuleVariables.map(programRulesVariable => ({
        ...programRulesVariable,
        programId: getProgramId(programRulesVariable),
        dataElementId: getDataElementId(programRulesVariable),
        trackedEntityAttributeId: getTrackedEntityAttributeId(programRulesVariable),
    }));
};

const addProgramRules = (program: any, programRules: any[]): void => {
    program.programRules = programRules.map(programRule => ({
        ...programRule,
        programId: getProgramId(programRule),
        programStageId: getProgramStageId(programRule),
        programRuleActions: getProgramRuleActions(programRule.programRuleActions),
    }));
};

const addRulesAndVariablesFromProgramIndicators = (rulesContainer: any, programIndicators: any[], programId: string): void => {
    const validProgramIndicators = programIndicators.filter((indicator) => {
        if (!indicator.expression) {
            log.error(
                errorCreator('WidgetProfile: Program indicator is missing an expression and will be skipped.')(
                    {
                        method: 'addRulesAndVariablesFromProgramIndicators',
                        object: indicator,
                    },
                ),
            );
            return false;
        }
        return true;
    });

    const indicators = validProgramIndicators.map(programIndicator => ({
        ...programIndicator,
        programId: getProgramId(programIndicator),
    }));
    const { rules, variables } = getRulesAndVariablesFromProgramIndicators(indicators, programId);

    if (variables) {
        rulesContainer.programRuleVariables = [...rulesContainer.programRuleVariables, ...variables];
    }
    if (rules) {
        rulesContainer.programRules = [...rulesContainer.programRules, ...rules];
    }
};

export const buildRulesContainer = async ({
    programAPI,
    programRules,
    constants,
    setRulesContainer,
}: BuildRulesContainerParams): Promise<void> => {
    const { programRuleVariables, programIndicators } = programAPI;
    const rulesContainer: any = {};

    programRuleVariables && addProgramVariables(rulesContainer, programRuleVariables);
    programRules && addProgramRules(rulesContainer, programRules);
    programIndicators && addRulesAndVariablesFromProgramIndicators(rulesContainer, programIndicators, programAPI.id);
    rulesContainer.constants = constants;

    setRulesContainer(rulesContainer);
};
