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
    ProgramRulesContainer,
    EventData,
    DataElements,
    OrgUnit,
    OptionSets,
    TrackedEntityAttributes,
    Enrollment,
    EventsDataContainer,
    TEIValues,
    ProgramRule,
    RuleVariables,
    ProgramRuleEffect,
} from './rulesEngine.types';

type ExecutionService = {
    getEffects: (
      programRules: ?Array<ProgramRule>,
      dataElements: ?DataElements,
      trackedEntityAttributes: ?TrackedEntityAttributes,
      variablesHash: RuleVariables,
      processType: string,
      flag: ?{ debug: boolean },
    ) => ?Array<ProgramRuleEffect>,
    convertDataToBaseOutputValue: (data: any, valueType: string) => any,
};

export default class RulesEngine {
    executionService: ExecutionService;
    variableService: VariableService;
    onProcessRulesEffects: (
      effects: Array<ProgramRuleEffect>,
      processType: $Values<typeof processTypes>,
      dataElements: ?DataElements,
      trackedEntityAttributes?: ?TrackedEntityAttributes) => ?OutputEffects;

    constructor() {
        const valueProcessor = new ValueProcessor(inputValueConverter);
        this.variableService = new VariableService(valueProcessor.processValue);
        this.executionService = getExecutionService(this.variableService);
        this.onProcessRulesEffects = getRulesEffectsProcessor(
            this.executionService.convertDataToBaseOutputValue,
            rulesEffectsValueConverter,
        );
    }

    executeRules(
        programRulesContainer: ProgramRulesContainer,
        currentEvent: EventData,
        allEvents: ?EventsDataContainer,
        dataElements: ?DataElements,
        enrollmentData: ?Enrollment,
        teiValues: ?TEIValues,
        trackedEntityAttributes: ?TrackedEntityAttributes,
        selectedOrgUnit: OrgUnit,
        optionSets: OptionSets,
        processType: $Values<typeof processTypes>,
    ): ?OutputEffects {
        const variablesHash = this.variableService.getVariables(
            programRulesContainer,
            currentEvent,
            allEvents,
            dataElements,
            trackedEntityAttributes,
            teiValues,
            enrollmentData,
            selectedOrgUnit,
            optionSets,
        );
        const { programRules } = programRulesContainer;

        const effects = this.executionService.getEffects(
            programRules,
            dataElements,
            trackedEntityAttributes,
            variablesHash,
            processTypes.TEI,
        );

        if (effects) {
            return this.onProcessRulesEffects(effects, processType, dataElements, trackedEntityAttributes);
        }
        return null;
    }
}
