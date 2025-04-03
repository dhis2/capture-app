// @flow
import log from 'loglevel';
import { errorCreator } from 'capture-core-utils';
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

const addRulesAndVariablesFromProgramIndicators = (rulesContainer, programIndicators, programId) => {
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
    programIndicators && addRulesAndVariablesFromProgramIndicators(rulesContainer, programIndicators, programAPI.id);
    rulesContainer.constants = constants;

    setRulesContainer(rulesContainer);
};
