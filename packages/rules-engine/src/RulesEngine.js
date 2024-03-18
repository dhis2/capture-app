// @flow
import log from 'loglevel';
import { VariableService } from './services/VariableService';
import { ValueProcessor } from './processors/ValueProcessor';
import { executeExpression } from './services/expressionService';
import { getD2Functions } from './d2Functions';
import type {
    OutputEffects,
    RulesEngineInput,
    IConvertInputRulesValue,
    IConvertOutputRulesEffectsValue,
    IDateUtils,
    Flag,
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
    flags: Flag;

    constructor(
        inputConverter: IConvertInputRulesValue,
        outputConverter: IConvertOutputRulesEffectsValue,
        dateUtils: IDateUtils,
        environment: $Values<environmentTypes>,
        flags?: Flag,
    ) {
        this.inputConverter = inputConverter;
        this.outputConverter = outputConverter;
        this.valueProcessor = new ValueProcessor(inputConverter);
        this.variableService = new VariableService(this.valueProcessor.processValue, dateUtils, environment);
        this.dateUtils = dateUtils;
        this.flags = flags ?? {};
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
                        flags: this.flags,
                        onError: (error, injectedExpression, evalutationResult) => log.error(
                            `Expression with rule id: ${rule.id} could not be run. ` +
                            `Original condition was: ${expression} - ` +
                            `Evaluation ended up as: ${injectedExpression} - ` +
                            `Result of evaluation was: ${evalutationResult?.toString()} - ` +
                            `error message: ${error}`),
                        onVerboseLog: (injectedExpression, evalutationResult) => console.log(
                            `Expression with rule id: ${rule.id} was run. ` +
                            `Original condition was: ${expression} - ` +
                            `Evaluation ended up as: ${injectedExpression} - ` +
                            `Result of evaluation was: ${evalutationResult?.toString()}`),
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
                                flags: this.flags,
                                onError: (error, injectedExpression, evalutationResult) => log.error(
                                    `Expression with action id: action:${id} could not be run. ` +
                                    `Original condition was: ${actionExpression} - ` +
                                    `Evaluation ended up as:${injectedExpression} - ` +
                                    `Result of evaluation was: ${evalutationResult?.toString()} - ` +
                                    `Error message:${error}`),
                                onVerboseLog: (injectedExpression, evalutationResult) => console.log(
                                    `Expression with action id: action:${id} was run. ` +
                                    `Original condition was: ${actionExpression} - ` +
                                    `Evaluation ended up as: ${injectedExpression} - ` +
                                    `Result of evaluation was: ${evalutationResult?.toString()}`),
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
        return processRulesEffects({
            effects,
            dataElements,
            trackedEntityAttributes,
            // $FlowFixMe[exponential-spread]
            formValues: { ...selectedEntity, ...currentEvent },
            onProcessValue: this.valueProcessor.processValue,
        });
    }

    setSelectedUserRoles(userRoles: Array<string>) {
        this.userRoles = userRoles;
    }

    setFlags(flags: Flag) {
        this.flags = flags;
    }

    getFlags(): Flag {
        return this.flags;
    }
}
