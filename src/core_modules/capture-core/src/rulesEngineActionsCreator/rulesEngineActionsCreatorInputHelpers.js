// @flow
import { convertFormValuesToClient } from '../converters/helpers/formToClient';
import RenderFoundation from '../metaData/RenderFoundation/RenderFoundation';
import convertDataEntryValuesToClientValues from '../components/DataEntry/common/convertDataEntryValuesToClientValues';

export type FieldData = {
    elementId: string,
    value: any,
    valid: boolean,
};

function getDataEntryValidatons(dataEntryMeta: {[key: string]: { isValid: boolean }}) {
    return Object.keys(dataEntryMeta).reduce((accValidations, key) => {
        accValidations[key] = dataEntryMeta[key].isValid;
        return accValidations;
    }, {});
}

function getValidDataEntryValues(
    dataEntryValues: { [key: string]: any },
    dataEntryValidations: { [key: string]: boolean }) {
    return Object.keys(dataEntryValues).reduce((accValidValues, key) => {
        accValidValues[key] = dataEntryValidations[key] ? dataEntryValues[key] : null;
        return accValidValues;
    }, {});
}

function convertFormValuesToClientValues(formValues: {[key: string]: any}, renderFoundation: RenderFoundation) {
    return convertFormValuesToClient(formValues, renderFoundation);
}

function getValidFormValues(formValues: { [key: string]: any }, fieldsValidation: { [key: string]: boolean }) {
    return Object.keys(formValues)
        .reduce((accValidFormValues, key) => {
            const isValid = fieldsValidation[key];
            accValidFormValues[key] = isValid ? formValues[key] : null;
            return accValidFormValues;
        }, {});
}

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

export function getCurrentClientValues(
    state: ReduxState,
    foundation: RenderFoundation,
    formId: string,
    updatedEventField?: ?FieldData) {
    const currentFormData = state.formsValues[formId] || {};
    const updatedCurrentFormData = updatedEventField ?
        { ...currentFormData, [updatedEventField.elementId]: updatedEventField.value } :
        currentFormData;

    const sectionsFieldsUIState = state.formsSectionsFieldsUI;
    const fieldValidations = getFieldsValidationForForm(sectionsFieldsUIState, formId);
    const updatedFieldValidations = updatedEventField ?
        { ...fieldValidations, [updatedEventField.elementId]: updatedEventField.valid } :
        fieldValidations;

    const validFormValues = getValidFormValues(updatedCurrentFormData, updatedFieldValidations);

    const clientData = convertFormValuesToClientValues(validFormValues, foundation);
    return clientData;
}

export function getCurrentClientMainData(
    state: ReduxState,
    itemId: string,
    dataEntryId: string,
    previousClientData: {[key: string]: any}) {
    const dataEntryReduxKey = `${dataEntryId}-${itemId}`;

    const dataEntryFieldsUI = state.dataEntriesFieldsUI[dataEntryReduxKey];
    const dataEntryValidations = getDataEntryValidatons(dataEntryFieldsUI);
    const dataEntryValues = state.dataEntriesFieldsValue[dataEntryReduxKey];
    const validDataEntryValues = getValidDataEntryValues(dataEntryValues, dataEntryValidations);

    const dataEntryClientValues =
        convertDataEntryValuesToClientValues(
            validDataEntryValues,
            state.dataEntriesFieldsMeta[dataEntryReduxKey],
            previousClientData,
        );

    return dataEntryClientValues;
}
