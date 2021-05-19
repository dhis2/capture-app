// @flow
import log from 'loglevel';
import isString from 'd2-utilizr/lib/isString';
import isDefined from 'd2-utilizr/lib/isDefined';
import { VariableService } from './services/VariableService/VariableService';
import { ValueProcessor } from './processors/ValueProcessor';
import { executeExpression } from './services/executionService';
import { getDateUtils } from './commonUtils/dateUtils';
import { processTypes } from './processors/rulesEffectsProcessor/processTypes.const';
import { d2Functions } from './d2Functions';
import type {
    OutputEffects,
    ProgramRulesContainer,
    EventData,
    DataElements,
    OrgUnit,
    OptionSets,
    TrackedEntityAttributes,
    Enrollment,
    TEIValues,
    ProgramRule,
    RuleVariables,
    D2Functions,
} from './rulesEngine.types';
import { inputValueConverter } from './converters/inputValueConverter';
import { getRulesEffectsProcessor } from './processors/rulesEffectsProcessor/rulesEffectsProcessor';
import { rulesEffectsValueConverter } from './converters/rulesEffectsValueConverter';
import { momentConverter } from './converters/momentConverter';
import { effectActions } from './effectActions.const';
import { typeKeys } from './typeKeys.const';
import { trimQuotes } from './commonUtils/trimQuotes';

const convertRuleEffectDataToOutputBaseValue = (data: any, valueType: string) => {
    const convertNumber = (numberRepresentation) => {
        if (isString(numberRepresentation)) {
            if (isNaN(numberRepresentation)) {
                log.warn(`rule execution service could not convert ${numberRepresentation} to number`);
                return null;
            }
            return Number(numberRepresentation);
        }
        return numberRepresentation;
    };

    const ruleEffectDataConvertersByType = {
        [typeKeys.BOOLEAN]: (value) => {
            if (isString(value)) {
                return value === 'true';
            }
            return value;
        },
        [typeKeys.INTEGER]: convertNumber,
        [typeKeys.INTEGER_NEGATIVE]: convertNumber,
        [typeKeys.INTEGER_POSITIVE]: convertNumber,
        [typeKeys.INTEGER_ZERO_OR_POSITIVE]: convertNumber,
        [typeKeys.NUMBER]: convertNumber,
        [typeKeys.TRUE_ONLY]: () => true,
    };

    if (!data && data !== 0 && data !== false) {
        return null;
    }

    return ruleEffectDataConvertersByType[valueType] ? ruleEffectDataConvertersByType[valueType](data) : data;
};

/**
 * We update the variables hash so that the next rule can use the updated values.
 * @param content
 * @param action
 * @param data
 * @param variablesHash
 */
function updateVariableHashWhenActionIsAssignValue(content: string, action: string, data: any, variablesHash: RuleVariables) {
    if (action === effectActions.ASSIGN_VALUE && content) {
        const variableToAssign = content.replace('#{', '').replace('A{', '').replace('}', '');
        const variableHash = variablesHash[variableToAssign];

        if (!variableHash) {
            // If a variable is mentioned in the content of the rule, but does not exist in the variables hash, show a warning:
            log.warn(`Variable ${variableToAssign} was not defined.`);
        } else {
            // buildAssignVariable
            // todo according to types this must be a bug
            // $FlowFixMe[prop-missing] automated comment
            const { valueType } = variableHash;
            let variableValue = convertRuleEffectDataToOutputBaseValue(data, valueType);
            if (variableValue && isString(variableValue)) {
                variableValue = `'${variableValue}'`;
            }

            variablesHash[variableToAssign] = {
                ...variablesHash[variableToAssign],
                variableValue,
                variableType: valueType,
                hasValue: true,
                variableEventDate: '',
                variablePrefix: variableHash.variablePrefix || '#',
                allValues: [variableValue],
            };
        }
    }
}

/**
 * replaces the variables in an expression with actual variable values.
 * @param expression
 * @param variablesHash
 * @returns {*}
 */
const replaceVariablesWithValues = (expression: string, variablesHash: RuleVariables) => {
    const warnMessage = (expr, variablePresent) => {
        log.warn(`Expression ${expr} contains context variable ${variablePresent} 
    - but this variable is not defined.`);
    };


    if (expression.includes('{') === false) {
        return expression;
    }

    const avoidReplacementFunctions = ['d2:hasValue', 'd2:lastEventDate', 'd2:count', 'd2:countIfZeroPos', 'd2:countIfValue'];
    avoidReplacementFunctions.forEach((funcName) => {
        const rex = new RegExp(`${funcName}\\( *([A#CV]\\{[\\w -_.]+})( *, *(([\\d/\\*\\+\\-%. ]+)|'[^']*'))* *\\)`, 'g');

        const callsToThisFunction = expression.match(rex);
        if (Array.isArray(callsToThisFunction)) {
            callsToThisFunction
                .filter(call => call.includes(funcName))
                .forEach((call) => {
                    const newCall = call
                        .replace('#{', "'")
                        .replace('A{', "'")
                        .replace('C{', "'")
                        .replace('V{', "'")
                        .replace('}', "'");
                    expression = expression.replace(call, newCall);
                });
        }
    });

    // Check if the expression contains program rule variables at all(any curly braces):
    if (expression.indexOf('{') !== -1) {
        // Find every variable name in the expression;
        const variablesPresent = expression.match(/[A#CV]\{[\w -_.]+}/g);
        // Replace each matched variable:
        variablesPresent && variablesPresent.forEach((variablePresent) => {
            // First strip away any prefix and postfix signs from the variable name:
            variablePresent = variablePresent
                .replace('#{', '')
                .replace('A{', '')
                .replace('C{', '')
                .replace('V{', '')
                .replace('}', '');

            if (isDefined(variablesHash[variablePresent])) {
                // Replace all occurrences of the variable name(hence using regex replacement):
                expression = expression
                    .replace(
                        new RegExp(`${variablesHash[variablePresent].variablePrefix}\\{${variablePresent}\\}`, 'g'),
                        variablesHash[variablePresent].variableValue,
                    );
            } else {
                warnMessage(expression, variablePresent);
            }
        });
    }

    // todo this can most likely can be removed since the previous if statement is doing what all the rest if statements claim to do.
    // Check if the expression contains environment  variables
    if (expression.indexOf('V{') !== -1) {
        // Find every variable name in the expression;
        const variablesPresent = expression.match(/V{\w+.?\w*}/g);
        // Replace each matched variable:
        variablesPresent && variablesPresent.forEach((variablePresent) => {
            // First strip away any prefix and postfix signs from the variable name:
            variablePresent = variablePresent.replace('V{', '').replace('}', '');

            if (isDefined(variablesHash[variablePresent]) && variablesHash[variablePresent].variablePrefix === 'V') {
                // Replace all occurrences of the variable name(hence using regex replacement):
                expression = expression
                    .replace(
                        new RegExp(`V{${variablePresent}}`, 'g'),
                        variablesHash[variablePresent].variableValue,
                    );
            } else {
                warnMessage(expression, variablePresent);
            }
        });
    }

    // Check if the expression contains attribute variables:
    if (expression.indexOf('A{') !== -1) {
        // Find every attribute in the expression;
        const variablesPresent = expression.match(/A{\w+.?\w*}/g);
        // Replace each matched variable:
        variablesPresent && variablesPresent.forEach((variablePresent) => {
            // First strip away any prefix and postfix signs from the variable name:
            variablePresent = variablePresent.replace('A{', '').replace('}', '');

            if (isDefined(variablesHash[variablePresent]) && variablesHash[variablePresent].variablePrefix === 'A') {
                // Replace all occurrences of the variable name(hence using regex replacement):
                expression = expression
                    .replace(
                        new RegExp(`A{${variablePresent}}`, 'g'),
                        variablesHash[variablePresent].variableValue,
                    );
            } else {
                warnMessage(expression, variablePresent);
            }
        });
    }

    // Check if the expression contains constants
    if (expression.indexOf('C{') !== -1) {
        // Find every constant in the expression;
        const variablesPresent = expression.match(/C{\w+.?\w*}/g);
        // Replace each matched variable:
        variablesPresent && variablesPresent.forEach((variablePresent) => {
            // First strip away any prefix and postfix signs from the variable name:
            variablePresent = variablePresent.replace('C{', '').replace('}', '');

            if (isDefined(variablesHash[variablePresent]) && variablesHash[variablePresent].variablePrefix === 'C') {
                // Replace all occurrences of the variable name(hence using regex replacement):
                expression = expression
                    .replace(
                        new RegExp(`C{${variablePresent}}`, 'g'),
                        variablesHash[variablePresent].variableValue,
                    );
            } else {
                warnMessage(expression, variablePresent);
            }
        });
    }

    return expression;
};

/**
 *
 * @param {*} dhisFunctions all the d2:functions that we provide to the end-users
 * @param {*} programRules all program rules for the program
 * @param {*} dataElements all data elements(metadata)
 * @param {*} trackedEntityAttributes all tracked entity attributes(metadata)
 * @param {*} variablesHash is a table hash with all the variables that have rules attached to it
 * @param {*} processType is either TEI or EVENT
 */
function getProgramRuleEffects(
    dhisFunctions: D2Functions,
    programRules: ?Array<ProgramRule>,
    dataElements: ?DataElements,
    trackedEntityAttributes: ?TrackedEntityAttributes,
    variablesHash: RuleVariables,
    processType: string,
): ?OutputEffects {
    if (!programRules) {
        return null;
    }
    const processRulesEffects = getRulesEffectsProcessor(convertRuleEffectDataToOutputBaseValue, rulesEffectsValueConverter);

    const effects = programRules
        .sort((a, b) => {
            if (!a.priority && !b.priority) {
                return 0;
            }

            if (!a.priority) {
                return 1;
            }

            if (!b.priority) {
                return -1;
            }

            return a.priority - b.priority;
        })
        // For every rule there are two bits.
        // The first bit is the "program rule expression" which signifies whether or not the rule's actions are gonna take place
        // The second bit is  the "program rule effects" which defines the actions that need to take place.
        // In the following iteration we first evaluate the "program rule expression" and when this is effective
        // we generate the program rules effects
        .flatMap((rule) => {
            let isProgramRuleExpressionEffective = false;
            const { condition: expression } = rule;
            if (expression) {
                const strippedExpression = replaceVariablesWithValues(expression, variablesHash);
                // checks if the rule is effective meaning that the rule results to a truthy expression
                isProgramRuleExpressionEffective = executeExpression(dhisFunctions, strippedExpression, e => log.warn(`Expression with id rule:${rule.id} could not be run. Original condition was: ${rule.condition} - Evaluation ended up as:${expression} - error message:${e}`));
            } else {
                log.warn(`Rule id:'${rule.id}'' and name:'${rule.name}' had no condition specified. Please check rule configuration.`);
            }

            let programRuleEffects = [];
            if (isProgramRuleExpressionEffective) {
                programRuleEffects = rule.programRuleActions.map((
                    {
                        data: actionData,
                        programRuleActionType: action,
                        id,
                        location,
                        dataElementId,
                        trackedEntityAttributeId,
                        programStageId,
                        programStageSectionId,
                        optionGroupId,
                        optionId,
                        content,
                    }) => {
                    let ruleEffectData;
                    if (actionData) {
                        const strippedExpression = replaceVariablesWithValues(actionData, variablesHash);
                        const evaluatedRuleEffectData = executeExpression(dhisFunctions, strippedExpression, e => log.warn(`Expression with id rule: action:${id} could not be run. Original condition was: ${rule.condition} - Evaluation ended up as:${strippedExpression} - error message:${e}`));
                        ruleEffectData = trimQuotes(evaluatedRuleEffectData);
                    }

                    updateVariableHashWhenActionIsAssignValue(content, action, ruleEffectData, variablesHash);

                    return {
                        data: ruleEffectData,
                        id,
                        location,
                        action,
                        dataElementId,
                        trackedEntityAttributeId,
                        programStageId,
                        programStageSectionId,
                        optionGroupId,
                        optionId,
                        content,
                    };
                });
            }
            return programRuleEffects;
        })
        .filter(ruleEffects => ruleEffects);

    return processRulesEffects(effects, processType, dataElements, trackedEntityAttributes);
}

export class RulesEngine {
    static dateUtils = getDateUtils(momentConverter)

    static variableService() {
        const valueProcessor = new ValueProcessor(inputValueConverter);
        return new VariableService(valueProcessor.processValue);
    }


    static programRuleEffectsForTEI(
        programRulesContainer: ProgramRulesContainer,
        enrollmentData: ?Enrollment,
        teiValues: ?TEIValues,
        trackedEntityAttributes: ?TrackedEntityAttributes,
        selectedOrgUnit: OrgUnit,
        optionSets: OptionSets,
    ): ?OutputEffects {
        const { programRules } = programRulesContainer;

        const variablesHash = RulesEngine.variableService().getVariables(
            programRulesContainer,
            null,
            null,
            null,
            trackedEntityAttributes,
            teiValues,
            enrollmentData,
            selectedOrgUnit,
            optionSets,
        );

        const dhisFunctions = d2Functions(RulesEngine.dateUtils, RulesEngine.variableService(), variablesHash);
        return getProgramRuleEffects(dhisFunctions, programRules, null, trackedEntityAttributes, variablesHash, processTypes.TEI);
    }

    static programRuleEffectsForEvent(
        programRulesContainer: ProgramRulesContainer,
        events: EventData,
        dataElements: ?DataElements,
        selectedOrgUnit: OrgUnit,
        optionSets: OptionSets,
    ): ?OutputEffects {
        const { allEvents, currentEvent } = events;
        const { programRules, constants, programRulesVariables } = programRulesContainer;

        const variablesHash = RulesEngine.variableService().getVariables(
            { constants, programRulesVariables },
            currentEvent,
            allEvents,
            dataElements,
            null,
            null,
            null,
            selectedOrgUnit,
            optionSets,
        );

        const dhisFunctions = d2Functions(RulesEngine.dateUtils, RulesEngine.variableService(), variablesHash);
        return getProgramRuleEffects(dhisFunctions, programRules, dataElements, null, variablesHash, processTypes.EVENT);
    }
}
