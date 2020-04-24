// @flow
import VariableService from './VariableService/VariableService';
import ValueProcessor from './ValueProcessor/ValueProcessor';
import getExecutionService from './executionService/executionService';
import processTypes from './rulesEffectsProcessor/processTypes.const';
import inputValueConverter from './converters/inputValueConverter';
import type {
    OutputEffect,
    IConvertInputRulesValue,
    IConvertOutputRulesEffectsValue,
    IMomentConverter,
    ProgramRulesContainer,
    EventData,
    EventsData,
    DataElements,
    OrgUnit,
    OptionSets,
    TrackedEntityAttributes,
    Enrollment,
    ProgramRuleEffect,
    EventsDataContainer,
    TEIValues,
} from './rulesEngine.types';


type ExecutionService = {
    executeRules: (
        programRulesContainer: ProgramRulesContainer,
        executingEvent: ?EventData | {},
        events: ?EventsDataContainer,
        dataElements: ?DataElements,
        trackedEntityAttributes: ?TrackedEntityAttributes,
        selectedTrackedEntityAttributes: ?TEIValues,
        selectedEnrollment: ?Enrollment,
        selectedOrgUnit: OrgUnit,
        optionSets: ?OptionSets,
        flags: Object,
    ) => ?Array<ProgramRuleEffect>,
    convertDataToBaseOutputValue: (data: any, valueType: string) => any,
};

export default class RulesEngine {
  executionService: ExecutionService;
  variableService: VariableService;

  constructor() {
      const valueProcessor = new ValueProcessor(inputValueConverter);
      this.variableService = new VariableService(valueProcessor.processValue);
      this.executionService = getExecutionService(this.variableService);
  }

    executeRules(
        programRulesContainer: ProgramRulesContainer,
        executingEvent: ?EventData | {},
        eventsData: ?EventsData,
        dataElements: ?DataElements,
        enrollmentData: ?Enrollment,
        teiValues: ?TEIValues,
        trackedEntityAttributes: ?TrackedEntityAttributes,
        selectedOrgUnit: OrgUnit,
        optionSets: ?OptionSets,
        processType: $Values<typeof processTypes>,
    ): ?Array<OutputEffect> {
        let eventsContainer;
        if (eventsData && eventsData.length > 0) {
            const eventsDataByStage = eventsData.reduce((accEventsByStage, event) => {
                const hasProgramStage = !!event.programStageId;
                if (hasProgramStage) {
                    accEventsByStage[event.programStageId] = accEventsByStage[event.programStageId] || [];
                    accEventsByStage[event.programStageId].push(event);
                }
                return accEventsByStage;
            }, {});

            eventsContainer = {
                all: eventsData,
                byStage: eventsDataByStage,
            };
        } else {
            eventsContainer = null;
        }

        const effects = this.executionService.executeRules(
            programRulesContainer,
            executingEvent,
            eventsContainer,
            dataElements,
            trackedEntityAttributes,
            teiValues,
            enrollmentData,
            selectedOrgUnit,
            optionSets,
            { debug: true },
        );

        const processedEffects = effects ?
            this.onProcessRulesEffects(effects, processType, dataElements, trackedEntityAttributes) :
            null;
        return processedEffects;
    }
}
