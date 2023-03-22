// @flow
import log from 'loglevel';
import { VariableService } from './services/VariableService/VariableService';
import { ValueProcessor } from './processors/ValueProcessor';
import { executeExpression } from './services/expressionService';
import { getD2Functions } from './d2Functions';
import type {
    OutputEffects,
    RulesEngineInput,
    IConvertInputRulesValue,
    IConvertOutputRulesEffectsValue,
    IDateUtils,
} from './rulesEngine.types';
import { getRulesEffectsProcessor } from './processors/rulesEffectsProcessor/rulesEffectsProcessor';
import { effectActions, typeof environmentTypes } from './constants';

export class RulesEngine {
    inputConverter: IConvertInputRulesValue;
    outputConverter: IConvertOutputRulesEffectsValue;
    valueProcessor: ValueProcessor;
    variableService: VariableService;
    dateUtils: IDateUtils;
    userRoles: Array<string>;

    constructor(
        inputConverter: IConvertInputRulesValue,
        outputConverter: IConvertOutputRulesEffectsValue,
        dateUtils: IDateUtils,
        environment: $Values<environmentTypes>,
    ) {
        this.inputConverter = inputConverter;
        this.outputConverter = outputConverter;
        this.valueProcessor = new ValueProcessor(inputConverter);
        this.variableService = new VariableService(this.valueProcessor.processValue, dateUtils, environment);
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

        const dhisFunctions = getD2Functions({
            dateUtils: this.dateUtils,
            variablesHash,
            selectedOrgUnit,
            selectedUserRoles: selectedUserRoles ?? this.userRoles,
        });

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
                    // checks if the rule is effective meaning that the rule results to a truthy expression
                    isProgramRuleExpressionEffective = executeExpression({
                        expression,
                        dhisFunctions,
                        variablesHash,
                        onError: (error, injectedExpression) => log.warn(
                            `Expression with id rule:${rule.id} could not be run. ` +
                            `Original condition was: ${expression} - ` +
                            `Evaluation ended up as:${injectedExpression} - error message:${error}`),
                    });
                } else {
                    log.warn(`Rule id:'${rule.id}' and name:'${rule.displayName}' ` +
                        'had no condition specified. Please check rule configuration.');
                }

                let programRuleEffects = [];
                if (isProgramRuleExpressionEffective) {
                    programRuleEffects = rule.programRuleActions.map((
                        {
                            data: actionExpression,
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
                            name,
                        }) => {
                        let actionExpressionResult;
                        if (actionExpression) {
                            actionExpressionResult = executeExpression({
                                expression: actionExpression,
                                dhisFunctions,
                                variablesHash,
                                onError: (error, injectedExpression) => log.warn(
                                    `Expression with id rule: action:${id} could not be run. ` +
                                    `Original condition was: ${actionExpression} - ` +
                                    `Evaluation ended up as:${injectedExpression} - error message:${error}`),
                            });
                        }

                        if (action === effectActions.ASSIGN_VALUE && content) { // the program rule variable id is found in the content key
                            this.variableService.updateVariable(content, actionExpressionResult, variablesHash);
                        }

                        return {
                            data: actionExpressionResult,
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
                            name,
                        };
                    });
                }
                return programRuleEffects;
            })
            .filter(ruleEffects => ruleEffects);

        const processRulesEffects = getRulesEffectsProcessor(this.outputConverter);
        const formValues = currentEvent || selectedEntity;
        return processRulesEffects({
            effects,
            dataElements,
            trackedEntityAttributes,
            formValues,
            onProcessValue: this.valueProcessor.processValue,
        });
    }

    setSelectedUserRoles(userRoles: Array<string>) {
        this.userRoles = userRoles;
    }
}
