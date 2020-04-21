// @flow
import log from 'loglevel';
import { errorCreator } from 'capture-core-utils';
import { Program, TrackerProgram, EventProgram, RenderFoundation, DataElement } from '../metaData';
import constantsStore from '../metaDataMemoryStores/constants/constants.store';
import optionSetsStore from '../metaDataMemoryStores/optionSets/optionSets.store';
import type { DataElement as DataElementForRulesEngine } from '../../capture-core-utils/RulesEngine/rulesEngine.types';

const errorMessages = {
    PROGRAM_OR_FOUNDATION_MISSING: 'Program or foundation missing',
};


// TODO why when in our code at the moment we dont have any trackerPrograms we still keep this code?
function getTrackerDataElements(trackerProgram: TrackerProgram): Array<DataElement> {
    return Array.from(trackerProgram.stages.values())
        .reduce((accElements, stage) => {
            const stageElements = Array.from(stage.stageForm.sections.values())
                .reduce((accStageElements, section) =>
                    [...accStageElements, ...Array.from(section.elements.values())]
                , []);
            return [...accElements, ...stageElements];
        }, []);
}

function getEventDataElements(eventProgram: EventProgram): Array<DataElement> {
    return eventProgram.stage ?
        Array.from(eventProgram.stage.stageForm.sections.values()).reduce((accElements, section) =>
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


export function prepareForExecution(program: ?Program, foundation: ?RenderFoundation) {
    const error = {
        optionSets: null,
        dataElementsInProgram: null,
        programRulesVariables: null,
        programRules: null,
        constants: null,
    };
    if (!program || !foundation) {
        log.error(errorCreator(errorMessages.PROGRAM_OR_FOUNDATION_MISSING)(
            { program, foundation, method: 'getRulesActionsForEvent' }),
        );
        return error;
    }

    const { programRuleVariables } = program;
    const programRules = [...program.programRules, ...foundation.programRules];

    if (!programRules || programRules.length === 0) {
        return error;
    }

    const constants = constantsStore.get();
    const optionSets = optionSetsStore.get();
    const dataElementsInProgram = getDataElements(program);

    return { optionSets, dataElementsInProgram, programRulesVariables: programRuleVariables, programRules, constants };
}
