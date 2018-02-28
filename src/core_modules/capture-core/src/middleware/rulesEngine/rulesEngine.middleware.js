// @flow
import log from 'loglevel';
import { ensureState } from 'redux-optimistic-ui';

import RulesEngine from '../../RulesEngine/RulesEngine';
import valueConverter from './valueConverter';
import momentConverter from './momentConverter';

import errorCreator from '../../utils/errorCreator';
import { actionTypes as dataEntryActionTypes } from '../../components/DataEntry/actions/dataEntry.actions';
import programCollection from '../../metaDataMemoryStores/programCollection/programCollection';
import Program from '../../metaData/Program/Program';
import TrackerProgram from '../../metaData/Program/TrackerProgram';
import EventProgram from '../../metaData/Program/EventProgram';
import RenderFoundation from '../../metaData/RenderFoundation/RenderFoundation';
import { convertFormValuesToClient } from '../../converters/helpers/formToClient';
import { convertValue } from '../../converters/formToClient';

import constantsStore from '../../metaDataMemoryStores/constants/constants.store';
import optionSetsStore from '../../metaDataMemoryStores/optionSets/optionSets.store';
import DataElement from '../../metaData/DataElement/DataElement';

import type { OptionSets, ProgramRulesContainer, DataElement as DataElementForRulesEngine, EventData, OrgUnit } from '../../RulesEngine/rulesEngine.types';

type Next = (action: ReduxAction<any, any>) => void;

const rulesEngine = new RulesEngine(valueConverter, momentConverter);

const errorMessages = {
    PROGRAM_NOT_FOUND: 'Program not found in rulesEngine middleware',
    PROGRAMSTAGE_NOT_FOUND: 'ProgramStage not found',
};

const actionTypes = {
    UPDATE_VALUES: 'UpdateFormsValues',
    UPDATE_MESSAGES: 'RulesUpdateMessages',
    UPDATE_HIDDEN: 'RulesUpdateHidden',
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

function getCurrentEventValues(state: ReduxState, program: Program, action: ReduxAction<Object, null>, event: Event, formId: string) {
    const sectionsFieldsUIState = ensureState(state.formsSectionsFieldsUI);
    const fieldValidations = getFieldsValidationForForm(sectionsFieldsUIState, formId);
    fieldValidations[action.payload.elementId] = action.payload.uiState.valid;

    const currentFormData = ensureState(state.formsValues)[formId] || {};
    const updatedCurrentFormData = { ...currentFormData, [action.payload.elementId]: action.payload.value };

    const validFormValues = getValidFormValues(updatedCurrentFormData, fieldValidations);

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

function getRulesEngineArguments(program: Program, action: ReduxAction<Object, null>, state: ReduxState, event: Event, formId: string, dataEntryId: string) {
    const dataElementsInProgram = getDataElements(program);

    const currentEventValues = getCurrentEventValues(state, program, action, event, formId);
    const currentEventMainData = getCurrentEventMainData(state, event, dataEntryId);
    const currentEventData = { ...currentEventValues, ...currentEventMainData };

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

function runRulesEngine(programRulesContainer: ProgramRulesContainer, dataElementsInProgram: { [elementId: string]: DataElementForRulesEngine }, currentEventData: EventData, allEventsData: Array<EventData>, orgUnit: OrgUnit, optionSets: ?OptionSets) {
    rulesEngine.executeRules(programRulesContainer, currentEventData, allEventsData, dataElementsInProgram, orgUnit, optionSets);
}

export default (store: ReduxStore) => (next: Next) => (action: ReduxAction<any, any>) => {
    if (action.type === dataEntryActionTypes.UPDATE_FORM_FIELD) {
        const state = store.getState();
        const formId = action.payload.formId;
        const eventId = formId;
        const event = ensureState(state.events)[eventId];
        const programId = event.programId;

        const program = programCollection.get(programId);
        if (!program) {
            errorCreator(errorMessages.PROGRAM_NOT_FOUND)({ action });
            next(action);
            return;
        }

        const programRulesContainer = getProgramRulesContainer(program);
        if (!programRulesContainer.programRules || programRulesContainer.programRules.length === 0) {
            next(action);
            return;
        }

        const { dataElementsInProgram, currentEventData, allEventsData, optionSets, orgUnit } = getRulesEngineArguments(program, action, state, event, formId, action.payload.dataEntryId);
        const rulesEffects = runRulesEngine(programRulesContainer, dataElementsInProgram, currentEventData, allEventsData, orgUnit, optionSets);


        next(action);
    } else {
        next(action);
    }
};
