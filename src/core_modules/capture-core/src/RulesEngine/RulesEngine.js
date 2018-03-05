// @flow
import VariableService from './VariableService/VariableService';
import ValueProcessor from './ValueProcessor/ValueProcessor';
import getExecutionService from './executionService/executionService';
import getDateUtils from './dateUtils/dateUtils';

import type { IConvertRulesValue, IMomentConverter, ProgramRulesContainer, EventData, EventsData, DataElements, OrgUnit, OptionSets, Translator, TrackedEntityAttributes, Entity, Enrollment, ProgramRuleEffect, EventsDataContainer } from './rulesEngine.types';

type ExecutionService = {
    executeRules: (
        programRulesContainer: ProgramRulesContainer,
        executingEvent: ?EventData,
        events: ?EventsDataContainer,
        dataElements: ?DataElements,
        trackedEntityAttributes: ?TrackedEntityAttributes,
        selectedEntity: ?Entity,
        selectedEnrollment: ?Enrollment,
        selectedOrgUnit: OrgUnit,
        optionSets: ?OptionSets,
        flags: Object,
    ) => ?Array<ProgramRuleEffect>,
};

export default class RulesEngine {
    executionService: ExecutionService;

    constructor(converterObject: IConvertRulesValue, momentConverter: IMomentConverter, onTranslate: Translator) {
        const valueProcessor = new ValueProcessor(converterObject);
        const dateUtils = getDateUtils(momentConverter);
        const variableService = new VariableService(valueProcessor.processValue, dateUtils);
        this.executionService = getExecutionService(onTranslate, variableService, dateUtils);
    }

    executeRulesForSingleEvent(
        programRulesContainer: ProgramRulesContainer,
        executingEvent: EventData,
        eventsData: EventsData,
        dataElements: DataElements,
        selectedOrgUnit: OrgUnit,
        optionSets: ?OptionSets) {
        // create eventsByStage provisionally
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

        const effects = this.executionService.executeRules(programRulesContainer, executingEvent, eventsContainer, dataElements, null, null, null, selectedOrgUnit, optionSets, { debug: true });
        return effects;
    }
}
