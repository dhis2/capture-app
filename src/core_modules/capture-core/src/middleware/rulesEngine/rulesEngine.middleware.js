// @flow
import log from 'loglevel';
import { ensureState } from 'redux-optimistic-ui';

import errorCreator from '../../utils/errorCreator';
import { actionTypes as d2FormActionTypes } from '../../components/D2Form/D2SectionFields.actions';
import programCollection from '../../metaDataMemoryStores/programCollection/programCollection';
import Program from '../../metaData/Program/Program';
import TrackerProgram from '../../metaData/Program/TrackerProgram';
import EventProgram from '../../metaData/Program/EventProgram';
import RenderFoundation from '../../metaData/RenderFoundation/RenderFoundation';
import { convertFormValuesToClient } from '../../converters/helpers/formToClient';

import constantsStore from '../../metaDataMemoryStores/constants/constants.store';

type Next = (action: ReduxAction<any, any>) => void;

type ProgramRulesContainer = {
    programRulesVariables: ?Array<ProgramRuleVariable>,
    programRules: ?Array<ProgramRule>,
};

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

function getTrackerMetaElements(trackerProgram: TrackerProgram) {
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

function getEventMetaElements(eventProgram: EventProgram) {
    const elements = eventProgram.stage ?
        Array.from(eventProgram.stage.sections.values()).reduce((accElements, section) =>
            [...accElements, ...Array.from(section.elements.values())], []) :
        [];
    return elements;
}

function getMetaElements(program: Program) {
    if (program instanceof TrackerProgram) {
        return getTrackerMetaElements(program);
    }

    if (program instanceof EventProgram) {
        return getEventMetaElements(program);
    }

    return [];
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

// WILL GET MORE COMPLICATED :(
function getAllEventsValues(state: ReduxState, currentEventValues: { [key: string]: any}, event: Event) {
    const eventsValues = ensureState(state.eventsValues);
    eventsValues[event.eventId] = currentEventValues;
    return eventsValues;
}

function getRulesEngineArguments(program: Program, action: ReduxAction<Object, null>, state: ReduxState, event: Event, formId: string) {
    const dataElementsInProgram = getMetaElements(program);
    const currentEventValues = getCurrentEventValues(state, program, action, event, formId);
    const allEventsValues = getAllEventsValues(state, currentEventValues, event);
    return {
        dataElementsInProgram,
        currentEventValues,
        allEventsValues,
    };
}

function runRulesEngine(programRulesContainer: ProgramRulesContainer, currentEventValues: { [elementId: string]: any }) {

}


export default (store: ReduxStore) => (next: Next) => (action: ReduxAction<any, any>) => {
    if (action.type === d2FormActionTypes.UPDATE_FIELD) {
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

        const { dataElementsInProgram, currentEventValues, allEventsValues } = getRulesEngineArguments(program, action, state);



        next(action);
    } else {
        next(action);
    }
};
