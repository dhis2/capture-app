// @flow
import { InputBuilder } from './InputBuilder';
import type {
    OutputEffects,
    RulesEngineInput,
    IConvertInputRulesValue,
    IConvertOutputRulesEffectsValue,
    Flag,
} from './rulesEngine.types';
import { RuleEngineJs } from '@dhis2/rule-engine';

export class RuleEngine {
    inputConverter: IConvertInputRulesValue;
    outputConverter: IConvertOutputRulesEffectsValue;
    userRoles: Array<string>;
    flags: Flag;

    constructor(
        inputConverter: IConvertInputRulesValue,
        outputConverter: IConvertOutputRulesEffectsValue,
        flags?: Flag,
    ) {
        this.inputConverter = inputConverter;
        this.outputConverter = outputConverter;
        this.flags = flags ?? {};
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
    }: RulesEngineInput): OutputEffects {
        const inputBuilder = new InputBuilder(this.inputConverter, dataElements, trackedEntityAttributes, selectedOrgUnit);
        const executionContext = inputBuilder.buildRuleEngineContext({
            programRulesContainer,
            selectedUserRoles,
            selectedOrgUnit,
            optionSets,
        });
        const enrollment = selectedEnrollment && selectedEntity ?
            inputBuilder.buildEnrollment({
                selectedEnrollment,
                selectedEntity,
                selectedOrgUnit,
            }) : null;
        const events = otherEvents ?
            otherEvents.map(inputBuilder.convertEvent) :
            [];

        const rawEffects = currentEvent ?
            new RuleEngineJs().evaluateEvent(
                inputBuilder.convertEvent(currentEvent),
                enrollment,
                events,
                executionContext,
            ) :
            new RuleEngineJs().evaluateEnrollment(
                enrollment,
                events,
                executionContext,
            );

        return [];
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
