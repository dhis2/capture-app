// @flow
import log from 'loglevel';
import isString from 'd2-utilizr/lib/isString';
import isDefined from 'd2-utilizr/lib/isDefined';
import { VariableService } from './services/VariableService/VariableService';
import { ValueProcessor } from './processors/ValueProcessor';
import { executeExpression } from './services/executionService';
import { d2Functions } from './d2Functions';
import type {
    OutputEffects,
    RuleVariables,
    RulesEngineInput,
    IConvertInputRulesValue,
    IConvertOutputRulesEffectsValue,
    IDateUtils,
} from './rulesEngine.types';
import { getRulesEffectsProcessor } from './processors/rulesEffectsProcessor/rulesEffectsProcessor';
import { effectActions, typeof environmentTypes } from './constants';
import { trimQuotes } from './commonUtils/trimQuotes';
import { normalizeRuleVariable } from './commonUtils/normalizeRuleVariable';

/**
 * We update the variables hash so that the next rule can use the updated values.
 * @param variableToAssign
 * @param data
 * @param variablesHash
 */
function updateVariable(variableToAssign: string, data: any, variablesHash: RuleVariables) {
    const variableHashKey = variableToAssign.replace('#{', '').replace('A{', '').replace('}', '');
    const variableHash = variablesHash[variableHashKey];

    if (!variableHash) {
        // If a variable is mentioned in the content of the rule, but does not exist in the variables hash, show a warning:
        log.warn(`Variable ${variableHashKey} was not defined.`);
    } else {
        const { variableType } = variableHash;
        let variableValue = normalizeRuleVariable(data, variableType);
        if (variableValue && isString(variableValue)) {
            variableValue = `'${variableValue}'`;
        }

        variablesHash[variableHashKey] = {
            ...variableHash,
            variableValue,
            variableType,
            hasValue: true,
            variableEventDate: '',
            variablePrefix: variableHash.variablePrefix || '#',
            allValues: [variableValue],
        };
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

export class RulesEngine {
    inputConverter: IConvertInputRulesValue;
    outputConverter: IConvertOutputRulesEffectsValue;
    variableService: VariableService;
    dateUtils: IDateUtils;

    constructor(
        inputConverter: IConvertInputRulesValue,
        outputConverter: IConvertOutputRulesEffectsValue,
        dateUtils: IDateUtils,
        environment: $Values<environmentTypes>,
    ) {
        this.inputConverter = inputConverter;
        this.outputConverter = outputConverter;
        const valueProcessor = new ValueProcessor(inputConverter);
        this.variableService = new VariableService(valueProcessor.processValue, dateUtils, environment);
        this.dateUtils = dateUtils;
    }

    /**
    *
    * @param {*} programRulesContainer all program rules and program rule variables
    * @param {*} currentEvent selected event (null if not applicable)
    * @param {*} eventsContainer list of all relevant events, or null
    * @param {*} dataElements all data elements (metadata)
    * @param {*} selectedEntity selected TEI (null if not applicable)
    * @param {*} trackedEntityAttributes all tracked entity attributes (metadata)
    * @param {*} selectedEnrollment selected enrollment (null if not applicable)
    * @param {*} selectedOrgUnit selected OrgUnit
    * @param {*} optionSets all option sets
    */

    getProgramRuleEffects({
        programRulesContainer: { programRules, programRuleVariables, constants },
        currentEvent,
        otherEvents,
        dataElements,
        trackedEntityAttributes,
        selectedEntity,
        selectedEnrollment,
        selectedOrgUnit,
        selectedUserRoles,
        optionSets,
    }: RulesEngineInput): OutputEffects {
        const variablesHash = this.variableService.getVariables({
            programRuleVariables,
            currentEvent: currentEvent ?? undefined,
            otherEvents: otherEvents ?? undefined,
            dataElements,
            selectedEntity,
            trackedEntityAttributes,
            selectedEnrollment,
            selectedOrgUnit,
            optionSets,
            constants,
        });

        const dhisFunctions = d2Functions(this.dateUtils, this.variableService, variablesHash, selectedOrgUnit, selectedUserRoles);

        if (!programRules) {
            return [];
        }

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
                            displayContent,
                            style,
                        }) => {
                        let ruleEffectData;
                        if (actionData) {
                            const strippedExpression = replaceVariablesWithValues(actionData, variablesHash);
                            const evaluatedRuleEffectData = executeExpression(dhisFunctions, strippedExpression, e => log.warn(`Expression with id rule: action:${id} could not be run. Original condition was: ${rule.condition} - Evaluation ended up as:${strippedExpression} - error message:${e}`));
                            ruleEffectData = trimQuotes(evaluatedRuleEffectData);
                        }

                        if (action === effectActions.ASSIGN_VALUE && content) { // the program rule variable id is found in the content key
                            updateVariable(content, ruleEffectData, variablesHash);
                        }

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
                            displayContent,
                            style,
                        };
                    });
                }
                return programRuleEffects;
            })
            .filter(ruleEffects => ruleEffects);

        const processRulesEffects = getRulesEffectsProcessor(this.outputConverter);
        return processRulesEffects(effects, dataElements, trackedEntityAttributes);
    }
}
