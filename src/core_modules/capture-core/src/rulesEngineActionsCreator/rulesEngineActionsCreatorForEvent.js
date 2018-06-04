// @flow
/**
 * @module rulesEngineActionsCreatorForEvent
 */
import log from 'loglevel';

import RulesEngine from '../RulesEngine/RulesEngine';
import inputValueConverter from './inputValueConverter';
import outputRulesEffectsValueConverter from './rulesEffectsValueConverter';
import momentConverter from './momentConverter';
import { getTranslation } from '../d2/d2Instance';

import errorCreator from '../utils/errorCreator';
import Program from '../metaData/Program/Program';
import TrackerProgram from '../metaData/Program/TrackerProgram';
import EventProgram from '../metaData/Program/EventProgram';
import RenderFoundation from '../metaData/RenderFoundation/RenderFoundation';

import constantsStore from '../metaDataMemoryStores/constants/constants.store';
import optionSetsStore from '../metaDataMemoryStores/optionSets/optionSets.store';
import DataElement from '../metaData/DataElement/DataElement';

import { updateRulesEffects, updateFieldFromRuleEffect } from './rulesEngine.actions';
import effectActions from '../RulesEngine/effectActions.const';

import type {
    OptionSets,
    ProgramRulesContainer,
    DataElement as DataElementForRulesEngine,
    EventData,
    OrgUnit,
    OutputEffect,
    AssignOutputEffect,
    HideOutputEffect,
    EventMain,
    EventValues,
} from '../RulesEngine/rulesEngine.types';

export type EventContainer = {
    main: EventMain,
    values: EventValues
};

export type FieldData = {
    elementId: string,
    value: any,
    valid: boolean,
};

const rulesEngine =
    new RulesEngine(inputValueConverter, momentConverter, getTranslation, outputRulesEffectsValueConverter);

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
            const stageElements = Array.from(stage.sections.values())
                .reduce((accStageElements, section) =>
                    [...accStageElements, ...Array.from(section.elements.values())]
                    , []);
            return [...accElements, ...stageElements];
        }, []);
    return elements;
}

function getEventDataElements(eventProgram: EventProgram): Array<DataElement> {
    const elements = eventProgram.stage ?
        Array.from(eventProgram.stage.sections.values()).reduce((accElements, section) =>
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

function buildEffectsHierarchy(effects: Array<OutputEffect>) {
    return effects.reduce((accEffectsObject, effect) => {
        const actionType = effect.type;
        accEffectsObject[actionType] = accEffectsObject[actionType] || {};

        const id = effect.id;
        // $FlowSuppress
        accEffectsObject[actionType][id] = accEffectsObject[actionType][id] || [];
        // $FlowSuppress
        accEffectsObject[actionType][id].push(effect);
        return accEffectsObject;
    }, {});
}

function createAssignActions(assignEffects: ?{ [elementId: string]: Array<AssignOutputEffect> }, formId: string) {
    if (!assignEffects) {
        return [];
    }

    return Object.keys(assignEffects).map((elementId: string) => {
        // $FlowSuppress
        const effectsForId = assignEffects[elementId];
        const applicableEffectForId = effectsForId[effectsForId.length - 1];
        return updateFieldFromRuleEffect(applicableEffectForId.value, applicableEffectForId.id, formId);
    });
}

function filterFieldsHideEffects(
    hideEffects: ?{ [elementId: string]: Array<HideOutputEffect> },
    makeCompulsoryEffects: { [elementId: string]: Array<OutputEffect>} = {},
    foundation: RenderFoundation) {
    if (!hideEffects) {
        return hideEffects;
    }

    const elementIds = Object.keys(hideEffects);
    return elementIds
        .filter((elementId) => {
            const element = foundation.getElement(elementId);
            const dataCompulsory = element && element.compulsory;
            const compulsoryEffect = makeCompulsoryEffects[elementId];
            return !(dataCompulsory || compulsoryEffect);
        })
        .reduce((accFilteredEffects, elementId) => {
            // $FlowSuppress
            accFilteredEffects[elementId] = hideEffects[elementId];
            return accFilteredEffects;
        }, {});
}

function filterSectionsHideEffects(
    hideEffects: ?{ [elementId: string]: Array<HideOutputEffect> },
    makeCompulsoryEffects: { [elementId: string]: Array<OutputEffect>} = {},
    foundation: RenderFoundation) {
    if (!hideEffects) {
        return hideEffects;
    }

    const sectionIds = Object.keys(hideEffects);
    return sectionIds
        .filter((sectionId) => {
            const section = foundation.getSection(sectionId);
            if (!section) {
                return false;
            }

            const compulsoryFieldFound = Array.from(section.elements.entries())
                .map(entry => entry[1])
                .some((element) => {
                    const dataCompulsory = element.compulsory;
                    const compulsoryEffect = makeCompulsoryEffects[element.id];
                    return dataCompulsory || compulsoryEffect;
                });

            return !compulsoryFieldFound;
        })
        .reduce((accFilteredEffects, sectionId) => {
            // $FlowSuppress
            accFilteredEffects[sectionId] = hideEffects[sectionId];
            return accFilteredEffects;
        }, {});
}

function createHideFieldsResetActions(hideEffects: ?{ [elementId: string]: Array<HideOutputEffect> }, formId: string) {
    if (!hideEffects) {
        return [];
    }

    return Object.keys(hideEffects)
        .map((elementId: string) => updateFieldFromRuleEffect(null, elementId, formId));
}

function createHideSectionsResetActions(
    hideEffects: ?{ [sectionId: string]: Array<HideOutputEffect> },
    foundation: RenderFoundation,
    formId: string) {
    if (!hideEffects) {
        return [];
    }

    return Object.keys(hideEffects)
        .map((sectionId: string) => {
            const section = foundation.getSection(sectionId);

            if (!section) {
                return null;
            }

            return Array.from(section.elements.entries())
                .map(entry => entry[1])
                .map(element => updateFieldFromRuleEffect(null, element.id, formId));
        })
        .filter(action => action)
        // $FlowSuppress
        .reduce((accActions, sectionActions) => [...accActions, ...sectionActions], []);
}

function createRulesEffectsActions(
    rulesEffects: ?Array<OutputEffect>,
    formId: string,
    foundation: RenderFoundation) {
    if (!rulesEffects) {
        return [updateRulesEffects(null, formId)];
    }

    let actions = [];
    const effectsHierarchy = buildEffectsHierarchy(rulesEffects);

    effectsHierarchy[effectActions.HIDE_FIELD] =
        filterFieldsHideEffects(
            effectsHierarchy[effectActions.HIDE_FIELD],
            effectsHierarchy[effectActions.MAKE_COMPULSORY],
            foundation,
        );
    effectsHierarchy[effectActions.HIDE_SECTION] =
        filterSectionsHideEffects(
            effectsHierarchy[effectActions.HIDE_SECTION],
            effectsHierarchy[effectActions.MAKE_COMPULSORY],
            foundation,
        );

    actions.push(updateRulesEffects(effectsHierarchy, formId));

    actions = [...actions, ...createAssignActions(effectsHierarchy[effectActions.ASSIGN_VALUE], formId)];
    actions = [...actions, ...createHideFieldsResetActions(effectsHierarchy[effectActions.HIDE_FIELD], formId)];
    actions = [
        ...actions,
        ...createHideSectionsResetActions(effectsHierarchy[effectActions.HIDE_SECTION], foundation, formId),
    ];

    return actions;
}

function runRulesEngine(
    programRulesContainer: ProgramRulesContainer,
    dataElementsInProgram: { [elementId: string]: DataElementForRulesEngine },
    orgUnit: OrgUnit,
    optionSets: ?OptionSets,
    currentEventData: ?EventData,
    allEventsData: ?Array<EventData>) {
    const effects = rulesEngine.executeRulesForEvent(
        programRulesContainer,
        currentEventData,
        allEventsData,
        dataElementsInProgram,
        orgUnit,
        optionSets);
    return effects;
}

export function getRulesActionsForEvent(
    program: ?Program,
    foundation: ?RenderFoundation,
    formId: string,
    orgUnit: Object,
    currentEventData: ?EventData,
    allEventsData: ?Array<EventData>,
): Array<ReduxAction<any, any>> {
    if (!program || !foundation) {
        log.error(
            errorCreator(
                errorMessages.PROGRAM_OR_FOUNDATION_MISSING)({ program, foundation, method: 'getRulesActions' }));
        return [updateRulesEffects(null, formId)];
    }

    const programRulesContainer = getProgramRulesContainer(program, foundation);
    if (!programRulesContainer.programRules || programRulesContainer.programRules.length === 0) {
        return [updateRulesEffects(null, formId)];
    }

    const dataElementsInProgram = getDataElements(program);
    const optionSets = optionSetsStore.get();


    const rulesEffects =
        runRulesEngine(
            programRulesContainer,
            dataElementsInProgram,
            orgUnit,
            optionSets,
            currentEventData,
            allEventsData,
        );

    return createRulesEffectsActions(rulesEffects, formId, foundation);
}
