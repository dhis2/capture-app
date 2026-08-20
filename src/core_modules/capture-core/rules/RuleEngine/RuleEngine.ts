import { RuleEngineJs } from '@dhis2/rule-engine';
import {
    InputBuilder,
    ValueProcessor,
    evaluateRules,
    getRulesEffectsProcessor,
} from './helpers';
import type {
    OutputEffects,
    RulesEngineInput,
    IConvertInputRulesValue,
    IConvertOutputRulesEffectsValue,
    Flag,
    ProgramRuleEffect,
} from './types/ruleEngine.types';

export class RuleEngine {
    inputConverter: IConvertInputRulesValue;
    outputConverter: IConvertOutputRulesEffectsValue;
    valueProcessor: ValueProcessor;
    userRoles!: Array<string>;
    userGroups!: Array<string>;
    flags: Flag;

    constructor(
        inputConverter: IConvertInputRulesValue,
        outputConverter: IConvertOutputRulesEffectsValue,
        flags?: Flag,
    ) {
        this.inputConverter = inputConverter;
        this.outputConverter = outputConverter;
        this.valueProcessor = new ValueProcessor(inputConverter);
        this.flags = flags ?? { verbose: false };
    }

    getProgramRuleEffects({
        programRulesContainer,
        currentEvent,
        otherEvents,
        dataElements,
        trackedEntityAttributes,
        selectedEntity,
        selectedEnrollment,
        selectedOrgUnit,
        selectedUserRoles,
        optionSets,
        isFirstStageEventForm,
    }: RulesEngineInput): OutputEffects {
        if (!programRulesContainer.programRules ||
            !selectedOrgUnit ||
            (!currentEvent && !selectedEnrollment)) return [];

        const inputBuilder = new InputBuilder(
            this.inputConverter,
            dataElements,
            trackedEntityAttributes,
            optionSets,
            selectedOrgUnit,
        );
        const executionContext = inputBuilder.buildRuleEngineContext({
            programRulesContainer,
            selectedUserRoles: selectedUserRoles || this.userRoles,
            selectedUserGroups: this.userGroups,
        });
        const enrollment = selectedEnrollment ?
            inputBuilder.buildEnrollment({
                selectedEnrollment,
                selectedEntity,
            }) : null;

        const events = otherEvents ?
            otherEvents.map(inputBuilder.convertEvent) :
            [];

        const ruleEngine = new RuleEngineJs(this.flags.verbose || false);

        const effects = evaluateRules({
            ruleEngine,
            enrollment,
            currentEvent: currentEvent && inputBuilder.convertEvent(currentEvent),
            events,
            executionContext,
            isFirstStageEventForm,
        }).map(effect => ({
            ...Object.fromEntries(effect.ruleAction.values),
            action: effect.ruleAction.type,
            data: effect.data,
        })) as Array<ProgramRuleEffect>;

        const processRulesEffects = getRulesEffectsProcessor(this.outputConverter);
        return processRulesEffects({
            effects,
            dataElements,
            trackedEntityAttributes,
            formValues: { ...selectedEntity, ...currentEvent },
            onProcessValue: this.valueProcessor.processValue,
        });
    }

    setSelectedUserRoles(userRoles: Array<string>) {
        this.userRoles = userRoles;
    }

    setSelectedUserGroups(userGroups: Array<string>) {
        this.userGroups = userGroups;
    }

    setFlags(flags: Flag) {
        this.flags = flags;
    }

    getFlags(): Flag {
        return this.flags;
    }
}
