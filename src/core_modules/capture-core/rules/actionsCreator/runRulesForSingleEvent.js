// @flow
import log from 'loglevel';
import type {
    DataElement as DataElementForRulesEngine,
    EventsData,
    EventData,
    OrgUnit,
    OutputEffects,
} from 'capture-core-utils/rulesEngine';
import { rulesEngine } from '../rulesEngine';
import { errorCreator } from '../../../capture-core-utils';
import type { Program, RenderFoundation, DataElement, ProgramStage } from '../../metaData';
import { EventProgram } from '../../metaData';
import { constantsStore } from '../../metaDataMemoryStores/constants/constants.store';
import { optionSetStore } from '../../metaDataMemoryStores/optionSets/optionSets.store';
import { convertOptionSetsToRulesEngineFormat } from '../converters/optionSetsConverter';

const errorMessages = {
    PROGRAM_OR_FOUNDATION_MISSING: 'Program or foundation missing',
};

function getEventDataElements(stage: ?ProgramStage): Array<DataElement> {
    return stage ?
        Array.from(stage.stageForm.sections.values()).reduce((accElements, section) =>
            [...accElements, ...Array.from(section.elements.values())], []) :
        [];
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

function getDataElements(program: Program, stage: ?ProgramStage) {
    const dataElements: Array<DataElement> = getEventDataElements(program instanceof EventProgram ? program.stage : stage);

    return getRulesEngineDataElementsAsObject(dataElements);
}

function getEventsData(eventsData: ?EventsData) {
    if (eventsData && eventsData.length > 0) {
        const eventsDataByStage = eventsData.reduce((accEventsByStage, event) => {
            const hasProgramStage = !!event.programStageId;
            if (hasProgramStage) {
                accEventsByStage[event.programStageId] = accEventsByStage[event.programStageId] || [];
                accEventsByStage[event.programStageId].push(event);
            }
            return accEventsByStage;
        }, {});

        return { all: eventsData, byStage: eventsDataByStage };
    }

    return null;
}

function prepare(
    program: ?Program,
    foundation: ?RenderFoundation,
    allEventsData: ?EventsData,
    stage: ?ProgramStage,
) {
    if (!program || !foundation) {
        log.error(errorCreator(errorMessages.PROGRAM_OR_FOUNDATION_MISSING)(
            { program, foundation, method: 'getRulesActionsForEvent' }),
        );
        return null;
    }

    const { programRuleVariables } = program;
    const programRules = [...program.programRules, ...foundation.programRules];

    if (!programRules || programRules.length === 0) {
        return null;
    }

    const constants = constantsStore.get();
    const optionSets = convertOptionSetsToRulesEngineFormat(optionSetStore.get());
    const dataElementsInProgram = getDataElements(program, stage);
    const allEvents = getEventsData(allEventsData);

    return {
        optionSets,
        dataElementsInProgram,
        programRulesVariables: programRuleVariables,
        programRules,
        constants,
        allEvents,
    };
}

export function runRulesForSingleEvent(
    program: ?Program,
    foundation: ?RenderFoundation,
    orgUnit: OrgUnit,
    currentEvent: EventData,
    allEventsData: EventsData,
    stage: ?ProgramStage,
): ?OutputEffects {
    const data = prepare(program, foundation, allEventsData, stage);

    if (data) {
        const {
            optionSets,
            programRulesVariables,
            programRules,
            constants,
            dataElementsInProgram,
            allEvents,
        } = data;

        // returns an array of effects that need to take place in the UI.
        const effects = rulesEngine.getProgramRuleEffects({
            programRulesContainer: { programRulesVariables, programRules, constants },
            currentEvent,
            eventsContainer: allEvents,
            dataElements: dataElementsInProgram,
            selectedEntity: null,
            trackedEntityAttributes: null,
            selectedEnrollment: null,
            selectedOrgUnit: orgUnit,
            optionSets,
        });

        return (effects.length > 0) ? effects : null;
    }
    return null;
}
