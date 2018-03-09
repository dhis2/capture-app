// @flow
import log from 'loglevel';
import { ensureState } from 'redux-optimistic-ui';

import RulesEngine from '../RulesEngine/RulesEngine';
import inputValueConverter from './inputValueConverter';
import outputRulesEffectsValueConverter from './rulesEffectsValueConverter';
import momentConverter from './momentConverter';
import { getTranslation } from '../d2/d2Instance';

import errorCreator from '../utils/errorCreator';
import programCollection from '../metaDataMemoryStores/programCollection/programCollection';
import Program from '../metaData/Program/Program';
import TrackerProgram from '../metaData/Program/TrackerProgram';
import EventProgram from '../metaData/Program/EventProgram';
import RenderFoundation from '../metaData/RenderFoundation/RenderFoundation';
import { convertFormValuesToClient } from '../converters/helpers/formToClient';
import { convertValue } from '../converters/formToClient';

import constantsStore from '../metaDataMemoryStores/constants/constants.store';
import optionSetsStore from '../metaDataMemoryStores/optionSets/optionSets.store';
import DataElement from '../metaData/DataElement/DataElement';

import { updateRulesEffects, updateFieldFromRuleEffect } from './rulesEngine.actions';
import effectActions from '../RulesEngine/effectActions.const';

import type { OptionSets, ProgramRulesContainer, DataElement as DataElementForRulesEngine, EventData, OrgUnit, OutputEffect, AssignOutputEffect, HideOutputEffect, EventMain, EventValues } from '../RulesEngine/rulesEngine.types';

export type EventContainer = {
    main: EventMain,
    values: EventValues
};

type FieldData = {
    elementId: string,
    value: any,
    valid: boolean,
};

const rulesEngine = new RulesEngine(inputValueConverter, momentConverter, getTranslation, outputRulesEffectsValueConverter);

const errorMessages = {
    PROGRAM_NOT_FOUND: 'Program not found in loadAndExecuteRulesForEvent',
    PROGRAMSTAGE_NOT_FOUND: 'ProgramStage not found',
};

function getProgramRulesContainer(program: Program): ProgramRulesContainer {
    const programRulesVariables = program.programRuleVariables;
    const programRules = program.programRules;
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

function getRulesEngineDataElementsAsObject(dataElements: Array<DataElement>): { [elementId: string]: DataElementForRulesEngine } {
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

/**
 * concatenate fieldsValidation from sections 
 * 
 * @param {Object} sectionsFieldsUI
 * @param {string} formId
 */
function getFieldsValidationForForm(sectionsFieldsUI: Object, formId: string) {
    const fieldsUIState = Object.keys(sectionsFieldsUI)
        .filter(sectionKey => sectionKey.startsWith(formId))
        .reduce((accFormElementsUIState, stateKey) => {
            accFormElementsUIState = { ...accFormElementsUIState, ...sectionsFieldsUI[stateKey] };
            return accFormElementsUIState;
        }, {});

    const fieldsValidation = Object.keys(fieldsUIState)
        .reduce((accFieldsValidation, key) => {
            accFieldsValidation[key] = fieldsUIState[key].valid;
            return accFieldsValidation;
        }, {});

    return fieldsValidation;
}

/**
 * get valid form data based on fieldsValidation
 * 
 * @param {{ [key: string]: any }} formData
 * @param {{ [key: string]: boolean }} fieldsValidation
 * @returns
 */
function getValidFormValues(formValues: { [key: string]: any }, fieldsValidation: { [key: string]: boolean }) {
    return Object.keys(formValues)
        .reduce((accValidFormValues, key) => {
            const isValid = fieldsValidation[key];
            accValidFormValues[key] = isValid ? formValues[key] : null;
            return accValidFormValues;
        }, {});
}

/**
 * convert form values to client values
 * 
 * @param {{[key: string]: any}} formValues
 * @param {RenderFoundation} renderFoundation
 * @returns
 */
function convertFormValuesToClientValues(formValues: {[key: string]: any}, renderFoundation: RenderFoundation) {
    return convertFormValuesToClient(formValues, renderFoundation);
}

function getCurrentEventValues(
    state: ReduxState,
    program: Program,
    event: Event,
    formId: string,
    updatedEventField?: ?FieldData) {
    const currentFormData = ensureState(state.formsValues)[formId] || {};
    const updatedCurrentFormData = updatedEventField ? { ...currentFormData, [updatedEventField.elementId]: updatedEventField.value } : currentFormData;

    const sectionsFieldsUIState = ensureState(state.formsSectionsFieldsUI);
    const fieldValidations = getFieldsValidationForForm(sectionsFieldsUIState, formId);
    const updatedFieldValidations = updatedEventField ? { ...fieldValidations, [updatedEventField.elementId]: updatedEventField.valid } : fieldValidations;

    const validFormValues = getValidFormValues(updatedCurrentFormData, updatedFieldValidations);

    const clientData = convertFormValuesToClientValues(validFormValues, program.getStage(event.programStageId));
    return clientData;
}

function getDataEntryValidatons(dataEntryMeta: {[key: string]: { isValid: boolean }}) {
    return Object.keys(dataEntryMeta).reduce((accValidations, key) => {
        accValidations[key] = dataEntryMeta[key].isValid;
        return accValidations;
    }, {});
}

function getDataEntryTypes(dataEntryMeta: {[key: string]: { type: string }}) {
    return Object.keys(dataEntryMeta).reduce((accValidations, key) => {
        accValidations[key] = dataEntryMeta[key].type;
        return accValidations;
    }, {});
}

function getValidDataEntryValues(dataEntryValues: { [key: string]: any }, dataEntryValidations: { [key: string]: boolean }) {
    return Object.keys(dataEntryValues).reduce((accValidValues, key) => {
        accValidValues[key] = dataEntryValidations[key] ? dataEntryValues[key] : null;
        return accValidValues;
    }, {});
}

function convertDataEntryFormValuesToClientValues(validDataEntryValues: { [key: string]: any }, dataEntryTypes: { [key: string]: string }) {
    return Object.keys(validDataEntryValues).reduce((accConvertedValues, key) => {
        const valueToConvert = validDataEntryValues[key];
        const valueType = dataEntryTypes[key];
        accConvertedValues[key] = convertValue(valueType, valueToConvert);
        return accConvertedValues;
    }, {});
}

function getCurrentEventMainData(state: ReduxState, event: Event, dataEntryId: string) {
    const dataEntryReduxKey = `${dataEntryId}-${event.eventId}`;

    const dataEntryMeta = state.dataEntriesValuesMeta[dataEntryReduxKey];
    const dataEntryValidations = getDataEntryValidatons(dataEntryMeta);
    const dataEntryValues = state.dataEntriesValues[dataEntryReduxKey];
    const validDataEntryValues = getValidDataEntryValues(dataEntryValues, dataEntryValidations);

    const dataEntryTypes = getDataEntryTypes(dataEntryMeta);
    const dataEntryClientValues = convertDataEntryFormValuesToClientValues(validDataEntryValues, dataEntryTypes);

    const eventValues = ensureState(state.events)[event.eventId];
    return { ...eventValues, ...dataEntryClientValues };
}

// Also convert other open form data?
function getAllEventsValues(state: ReduxState, currentEventValues: { [key: string]: any}, event: Event) {
    const eventsValues = ensureState(state.eventsValues);
    eventsValues[event.eventId] = currentEventValues;
    return eventsValues;
}

// Also convert other open form data?
function getAllEventsMainData(state: ReduxState, currentEventMainData: { [key: string]: any}, event: Event) {
    const events = ensureState(state.events);
    events[event.eventId] = currentEventMainData;
    return events;
}

function createEventsArray(allEventsValues: { [eventId: string]: Object }, allEventsMainData: { [eventId: string]: Object }) {
    return Object.keys(allEventsValues)
        .map(key => ({ ...allEventsValues[key], ...allEventsMainData[key] }),
        );
}

function getSelectedOrgUnit(state: ReduxState) {
    return state.currentSelections.orgUnit;
}

function getRulesEngineArguments(
    program: Program,
    state: ReduxState,
    event: Event,
    formId: string,
    dataEntryId: string,
    updatedFieldData?: ?FieldData,
    isLoad?: ?boolean) {
    const dataElementsInProgram = getDataElements(program);

    let currentEventValues;
    let currentEventMainData;
    let currentEventData;
    if (!isLoad) {
        currentEventValues = getCurrentEventValues(state, program, event, formId, updatedFieldData);
        currentEventMainData = getCurrentEventMainData(state, event, dataEntryId);
        currentEventData = { ...currentEventValues, ...currentEventMainData };
    } else {
        currentEventValues = ensureState(state.eventsValues)[event.eventId];
        currentEventMainData = ensureState(state.events)[event.eventId];
        currentEventData = { ...currentEventValues, ...currentEventMainData };
    }

    const allEventsValues = getAllEventsValues(state, currentEventValues, event);
    const allEventsMainData = getAllEventsMainData(state, currentEventMainData, event);

    const allEventsData = createEventsArray(allEventsValues, allEventsMainData);

    const optionSets = optionSetsStore.get();

    const orgUnit = getSelectedOrgUnit(state);

    return {
        dataElementsInProgram,
        currentEventData,
        allEventsData,
        optionSets,
        orgUnit,
    };
}

function buildEffectsHierarchy(effects: Array<OutputEffect>) {
    return effects.reduce((accEffectsObject, effect) => {
        const actionType = effect.type;
        accEffectsObject[actionType] = accEffectsObject[actionType] || {};

        const id = effect.id;
        accEffectsObject[actionType][id] = accEffectsObject[actionType][id] || [];
        accEffectsObject[actionType][id].push(effect);
        return accEffectsObject;
    }, {});
}

function createAssignActions(assignEffects: ?{ [elementId: string]: Array<AssignOutputEffect> }, formId: string) {
    if (!assignEffects) {
        return [];
    }

    return Object.keys(assignEffects).map((elementId: string) => {
        const effectsForId = assignEffects[elementId];
        const applicableEffectForId = effectsForId[effectsForId.length - 1];
        return updateFieldFromRuleEffect(applicableEffectForId.value, applicableEffectForId.id, formId);
    });
}

function createHideFieldsResetActions(hideEffects: ?{ [elementId: string]: Array<HideOutputEffect> }, formId: string) {
    if (!hideEffects) {
        return [];
    }

    return Object.keys(hideEffects).map((elementId: string) => {
        const effectsForId = hideEffects[elementId];
        const applicableEffectForId = effectsForId[effectsForId.length - 1];
        return updateFieldFromRuleEffect(null, applicableEffectForId.id, formId);
    });
}

function createRulesEffectsActions(
    rulesEffects: ?Array<OutputEffect>,
    formId: string,
    eventId: string,
    dataEntryId: string) {
    if (!rulesEffects) {
        return [updateRulesEffects(null, formId, eventId, dataEntryId)];
    }

    let actions = [];
    const effectsHierarchy = buildEffectsHierarchy(rulesEffects);
    actions.push(updateRulesEffects(effectsHierarchy, formId, eventId, dataEntryId));

    actions = [...actions, ...createAssignActions(effectsHierarchy[effectActions.ASSIGN_VALUE], formId)];
    actions = [...actions, ...createHideFieldsResetActions(effectsHierarchy[effectActions.HIDE_FIELD], formId)];

    return actions;
}

function runRulesEngine(programRulesContainer: ProgramRulesContainer, dataElementsInProgram: { [elementId: string]: DataElementForRulesEngine }, currentEventData: EventData, allEventsData: Array<EventData>, orgUnit: OrgUnit, optionSets: ?OptionSets) {
    const effects = rulesEngine.executeRulesForSingleEvent(programRulesContainer, currentEventData, allEventsData, dataElementsInProgram, orgUnit, optionSets);
    return effects;
}

function getRulesActions(
    currentEventId: string,
    state: ReduxState,
    formId: string,
    dataEntryId: string,
    updatedFieldData?: ?FieldData,
    isLoad?: ?boolean): Array<ReduxAction<any, any>> {
    const eventId = currentEventId;
    const event = ensureState(state.events)[eventId];
    const programId = event.programId;

    const program = programCollection.get(programId);
    if (!program) {
        errorCreator(errorMessages.PROGRAM_NOT_FOUND)({ currentEventId });
        return [updateRulesEffects(null, formId, eventId, dataEntryId)];
    }

    const programRulesContainer = getProgramRulesContainer(program);
    if (!programRulesContainer.programRules || programRulesContainer.programRules.length === 0) {
        return [updateRulesEffects(null, formId, eventId, dataEntryId)];
    }

    const { dataElementsInProgram, currentEventData, allEventsData, optionSets, orgUnit } = getRulesEngineArguments(program, state, event, formId, dataEntryId, updatedFieldData, isLoad);
    const rulesEffects = runRulesEngine(programRulesContainer, dataElementsInProgram, currentEventData, allEventsData, orgUnit, optionSets);
    return createRulesEffectsActions(rulesEffects, formId, eventId, dataEntryId);
}

export function getRulesActionsOnLoad(
    currentEventId: string,
    state: ReduxState,
    formId: string,
    dataEntryId: string,
) {
    return getRulesActions(currentEventId, state, formId, dataEntryId, null, true);
}

export function getRulesActionsOnUpdate(
    currentEventId: string,
    state: ReduxState,
    formId: string,
    dataEntryId: string,
    updatedFieldData: FieldData): Array<ReduxAction<any, any>> {
    return getRulesActions(currentEventId, state, formId, dataEntryId, updatedFieldData);
}
