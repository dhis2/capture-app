// @flow
import VariableService from './VariableService/VariableService';
import ValueProcessor from './ValueProcessor/ValueProcessor';
import getExecutionService from './executionService/executionService';
import getDateUtils from './dateUtils/dateUtils';
import getRulesEffectsProcessor from './rulesEffectsProcessor/rulesEffectsProcessor';
import processTypes from './rulesEffectsProcessor/processTypes.const';

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
    Translator,
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
    onProcessRulesEffects: (
        effects: Array<ProgramRuleEffect>,
        processType: $Values<typeof processTypes>,
        dataElements: ?DataElements,
        trackedEntityAttributes?: ?TrackedEntityAttributes) => ?Array<OutputEffect>;

    constructor(
        inputConverterObject: IConvertInputRulesValue,
        momentConverter: IMomentConverter,
        onTranslate: Translator,
        outputRulesConverterObject: IConvertOutputRulesEffectsValue) {
        const valueProcessor = new ValueProcessor(inputConverterObject);
        const dateUtils = getDateUtils(momentConverter);
        const variableService = new VariableService(valueProcessor.processValue, dateUtils);
        this.executionService = getExecutionService(onTranslate, variableService, dateUtils);
        this.onProcessRulesEffects = getRulesEffectsProcessor(this.executionService.convertDataToBaseOutputValue, outputRulesConverterObject);
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
