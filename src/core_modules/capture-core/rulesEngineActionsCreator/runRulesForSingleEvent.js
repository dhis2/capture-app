// @flow
import log from 'loglevel';
import { RulesEngine, processTypes } from 'capture-core-utils/RulesEngine';
import type
{
    OptionSets,
    ProgramRulesContainer,
    DataElement as DataElementForRulesEngine,
    EventData,
    OrgUnit,
    EventMain,
    EventValues,
} from 'capture-core-utils/RulesEngine/rulesEngine.types';

import { errorCreator } from 'capture-core-utils';
import {
    Program,
    TrackerProgram,
    EventProgram,
    RenderFoundation,
    DataElement,
} from '../metaData';
import constantsStore from '../metaDataMemoryStores/constants/constants.store';
import optionSetsStore from '../metaDataMemoryStores/optionSets/optionSets.store';

export type EventContainer = {
    main: EventMain,
    values: EventValues
};

const errorMessages = {
    PROGRAM_NOT_FOUND: 'Program not found in loadAndExecuteRulesForEvent',
    PROGRAMSTAGE_NOT_FOUND: 'ProgramStage not found',
    PROGRAM_OR_FOUNDATION_MISSING: 'Program or foundation missing',
};

function getProgramRulesContainer(program: Program, foundation: RenderFoundation): ProgramRulesContainer {
    const programRulesVariables = program.programRuleVariables;

    const mainProgramRules = program.programRules;
    const foundationProgramRules = foundation.programRules;
    const programRules = [...mainProgramRules, ...foundationProgramRules];

    const constants = constantsStore.get();
    return {
        programRulesVariables,
        programRules,
        constants,
    };
}

function getTrackerDataElements(trackerProgram: TrackerProgram): Array<DataElement> {
    const elements = Array.from(trackerProgram.stages.values())
        .reduce((accElements, stage) => {
            const stageElements = Array.from(stage.stageForm.sections.values())
                .reduce((accStageElements, section) =>
                    [...accStageElements, ...Array.from(section.elements.values())]
                , []);
            return [...accElements, ...stageElements];
        }, []);
    return elements;
}

function getEventDataElements(eventProgram: EventProgram): Array<DataElement> {
    const elements = eventProgram.stage ?
        Array.from(eventProgram.stage.stageForm.sections.values()).reduce((accElements, section) =>
            [...accElements, ...Array.from(section.elements.values())], []) :
        [];
    return elements;
}

function getRulesEngineDataElementsAsObject(
    dataElements: Array<DataElement>): { [elementId: string]: DataElementForRulesEngine } {
    return dataElements.reduce((accRulesDataElements, dataElement) => {
        accRulesDataElements[dataElement.id] = {
            id: dataElement.id,
            valueType: dataElement.type,
            optionSetId: dataElement.optionSet && dataElement.optionSet.id,
        };
        return accRulesDataElements;
    }, {});
}

function getDataElements(program: Program) {
    let dataElements: Array<DataElement> = [];
    if (program instanceof TrackerProgram) {
        dataElements = getTrackerDataElements(program);
    }

    if (program instanceof EventProgram) {
        dataElements = getEventDataElements(program);
    }

    return getRulesEngineDataElementsAsObject(dataElements);
}


export default function runRulesForSingleEvent(
    rulesEngine: RulesEngine,
    program: ?Program,
    foundation: ?RenderFoundation,
    formId: string,
    orgUnit: Object,
    currentEventData: ?EventData,
    allEventsData: ?Array<EventData>,
) {
    if (!program || !foundation) {
        log.error(
            errorCreator(
                errorMessages.PROGRAM_OR_FOUNDATION_MISSING)(
                { program, foundation, method: 'getRulesActionsForEvent' }));
        return null;
    }

    const programRulesContainer = getProgramRulesContainer(program, foundation);
    if (!programRulesContainer.programRules || programRulesContainer.programRules.length === 0) {
        return null;
    }
    const dataElementsInProgram = getDataElements(program);
    const optionSets = optionSetsStore.get();

    const rulesEffects = rulesEngine.executeRules(programRulesContainer, currentEventData, allEventsData, dataElementsInProgram, null, null, null, orgUnit, optionSets, processTypes.EVENT);
    return rulesEffects;
}
