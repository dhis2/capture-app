// @flow
import VariableService from './VariableService/VariableService';
import ValueProcessor from './ValueProcessor/ValueProcessor';
import getExecutionService from './executionService/executionService';
import processTypes from './rulesEffectsProcessor/processTypes.const';
import inputValueConverter from './converters/inputValueConverter';
import getRulesEffectsProcessor from './rulesEffectsProcessor/rulesEffectsProcessor';
import rulesEffectsValueConverter from './converters/rulesEffectsValueConverter';

import type {
    OutputEffects,
    ProgramRuleEffect,
    ProgramRulesContainer,
    EventData,
    DataElements,
    OrgUnit,
    OptionSets,
    TrackedEntityAttributes,
    Enrollment,
    EventsDataContainer,
    TEIValues,
} from './rulesEngine.types';

type ExecutionService = {
    getEffects: (
      programRulesContainer: ProgramRulesContainer,
      executingEvent: ?EventData | {},
      events: ?EventsDataContainer,
      dataElements: ?DataElements,
      trackedEntityAttributes: ?TrackedEntityAttributes,
      selectedTrackedEntityAttributes: ?TEIValues,
      selectedEnrollment: ?Enrollment,
      selectedOrgUnit: OrgUnit,
      optionSets: ?OptionSets,
      processType: string,
      flags: Object,
    ) => ?Array<ProgramRuleEffect>,
    convertDataToBaseOutputValue: (data: any, valueType: string) => any,
};

export default class RulesEngine {
    executionService: ExecutionService;
    onProcessRulesEffects: (
      effects: Array<ProgramRuleEffect>,
      processType: $Values<typeof processTypes>,
      dataElements: ?DataElements,
      trackedEntityAttributes?: ?TrackedEntityAttributes) => ?OutputEffects;

    constructor() {
        const valueProcessor = new ValueProcessor(inputValueConverter);
        const variableService = new VariableService(valueProcessor.processValue);

        this.executionService = getExecutionService(variableService);
        this.onProcessRulesEffects = getRulesEffectsProcessor(
            this.executionService.convertDataToBaseOutputValue,
            rulesEffectsValueConverter,
        );
    }

    executeRules(
        programRulesContainer: ProgramRulesContainer,
        currentEvent: InputEvent,
        allEvents: ?EventsDataContainer,
        dataElements: ?DataElements,
        enrollmentData: ?Enrollment,
        teiValues: ?TEIValues,
        trackedEntityAttributes: ?TrackedEntityAttributes,
        selectedOrgUnit: OrgUnit,
        optionSets: ?OptionSets,
        processType: $Values<typeof processTypes>,
    ): ?OutputEffects {
        const effects = this.executionService.getEffects(
            programRulesContainer,
            currentEvent,
            allEvents,
            dataElements,
            trackedEntityAttributes,
            teiValues,
            enrollmentData,
            selectedOrgUnit,
            optionSets,
            processType,
            { debug: true });

        if (effects) {
            return this.onProcessRulesEffects(effects, processType, dataElements, trackedEntityAttributes);
        }
        return null;
    }
}
