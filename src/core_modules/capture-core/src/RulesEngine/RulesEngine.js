// @flow
import VariableService from './VariableService/VariableService';
import ValueProcessor from './ValueProcessor/ValueProcessor';
import getExecutionService from './executionService/executionService';
import getDateUtils from './dateUtils/dateUtils';

import type { IConvertRulesValue, IMomentConverter, ProgramRulesContainer, EventData, EventsData, DataElements, OrgUnit, OptionSets, Translator } from './rulesEngine.types';

type ExecutionService = {
    executeRules: () => void,
};

export default class RulesEngine {
    executionService: ExecutionService;

    constructor(converterObject: IConvertRulesValue, momentConverter: IMomentConverter, onTranslate: Translator) {
        /*
        const valueProcessor = new ValueProcessor(converterObject);
        const variableService = new VariableService(valueProcessor.processValue);
        const dateUtils = getDateUtils(momentConverter);
        this.executionService = getExecutionService(onTranslate, variableService, dateUtils);
        */
    }

    executeRules(
        programRulesContainer: ProgramRulesContainer,
        executingEvent: EventData,
        eventsData: EventsData,
        dataElements: DataElements,
        selectedOrgUnit: OrgUnit,
        optionSets: ?OptionSets) {
        
        /* TEMP */
        /*
        const eventsDataByStage = eventsData.reduce((accEventsByStage, event) => {
            const hasProgramStage = !!event.programStageId;
            if (hasProgramStage) {
                accEventsByStage[event.programStageId] = accEventsByStage[event.programStageId] || [];
                accEventsByStage[event.programStageId].push(event);
            }
            return accEventsByStage;
        }, {});

        const eventsContainer = {
            all: eventsData,
            byStage: eventsDataByStage,
        };

        this.variableService.getVariables(programRulesContainer, executingEvent, eventsContainer, dataElements, optionSets, selectedOrgUnit);
        */
    }
}
