// @flow
import { effectActions } from 'capture-core-utils/RulesEngine';
import type { OutputEffect } from 'capture-core-utils/RulesEngine/rulesEngine.types';
import { createReducerDescription } from '../../trackerRedux/trackerReducer';
import { actionTypes as fieldActionTypes } from '../../components/D2Form/D2SectionFields.actions';
import { actionTypes as loaderActionTypes } from '../../components/D2Form/actions/form.actions';
import { actionTypes as formBuilderActionTypes } from '../../components/D2Form/formBuilder.actions';
import { actionTypes as dataEntryActionTypes } from '../../components/DataEntry/actions/dataEntry.actions';
import { actionTypes as rulesEffectsActionTypes } from '../../rulesEngineActionsCreator/rulesEngine.actions';

export const formsValuesDesc = createReducerDescription({
    [loaderActionTypes.ADD_FORM_DATA]: (state, action) => {
        const newState = { ...state };
        const payload = action.payload;
        newState[payload.formId] = payload.formValues;
        return newState;
    },
    [fieldActionTypes.UPDATE_FIELD]: (state, action) => {
        const newState = { ...state };
        const payload = action.payload;
        const formValues = newState[payload.formId] = { ...newState[payload.formId] };
        formValues[payload.elementId] = payload.value;
        return newState;
    },
    [dataEntryActionTypes.UPDATE_FORM_FIELD]: (state, action) => {
        const newState = { ...state };
        const payload = action.payload;
        const formValues = newState[payload.formId] = { ...newState[payload.formId] };
        formValues[payload.elementId] = payload.value;
        return newState;
    },
    [rulesEffectsActionTypes.UPDATE_FIELD_FROM_RULE_EFFECT]: (state, action) => {
        const newState = { ...state };
        const payload = action.payload;
        const formValues = newState[payload.formId] = { ...newState[payload.formId] };
        formValues[payload.elementId] = payload.value;
        return newState;
    },
    [rulesEffectsActionTypes.UPDATE_RULES_EFFECTS]: (state, action) => {
        const assignEffects: { [id: string]: Array<OutputEffect> } =
            action.payload.rulesEffects && action.payload.rulesEffects[effectActions.ASSIGN_VALUE];
        if (!assignEffects) {
            return state;
        }
        const payload = action.payload;
        const newState = {
            ...state,
            [payload.formId]: {
                ...state[payload.formId],
                ...assignEffects,
            },
        };
        return newState;
    },

}, 'formsValues');

export const formsSectionsFieldsUIDesc = createReducerDescription({
    [loaderActionTypes.ADD_FORM_DATA]: (state, action) => {
        const newState = { ...state };
        const formId = action.payload.formId;

        Object
            .keys(newState)
            .filter(sectionKey => sectionKey.startsWith(formId))
            .forEach((formSectionKey) => {
                newState[formSectionKey] = {};
            });

        return newState;
    },
    [formBuilderActionTypes.FIELDS_VALIDATED]: (state, action) => {
        const newState = { ...state };
        const payload = action.payload;

        newState[payload.id] = Object.keys(payload.fieldsUI).reduce((accSectionFieldsUI, key) => {
            accSectionFieldsUI[key] = { ...accSectionFieldsUI[key], ...payload.fieldsUI[key], validatingMessage: null };
            return accSectionFieldsUI;
        }, { ...newState[payload.id] });
        return newState;
    },
    [fieldActionTypes.UPDATE_FIELD]: (state, action) => {
        const newState = { ...state };
        const payload = action.payload;
        newState[payload.sectionId] = { ...newState[payload.sectionId] };
        const sectionFieldsUI = newState[payload.sectionId];
        sectionFieldsUI[payload.elementId] = {
            ...sectionFieldsUI[payload.elementId],
            ...payload.uiState,
            modified: true,
            validatingMessage: null,
        };
        return newState;
    },
    [dataEntryActionTypes.UPDATE_FORM_FIELD]: (state, action) => {
        const newState = { ...state };
        const payload = action.payload;
        newState[payload.formBuilderId] = { ...newState[payload.formBuilderId] };
        const formBuilderFieldsUI = newState[payload.formBuilderId];
        formBuilderFieldsUI[payload.elementId] = {
            ...formBuilderFieldsUI[payload.elementId],
            ...payload.uiState,
            modified: true,
            validatingMessage: null,
        };
        return newState;
    },
    [formBuilderActionTypes.UPDATE_FIELD_UI_ONLY]: (state, action) => {
        const newState = { ...state };
        const payload = action.payload;
        newState[payload.sectionId] = { ...newState[payload.sectionId] };
        const sectionFieldsUI = newState[payload.sectionId];
        sectionFieldsUI[payload.elementId] = { ...sectionFieldsUI[payload.elementId], ...payload.uiState };
        return newState;
    },
    [formBuilderActionTypes.FIELD_IS_VALIDATING]: (state, action) => {
        const { fieldId, formBuilderId, message, fieldUIUpdates } = action.payload;
        return {
            ...state,
            [formBuilderId]: {
                ...state[formBuilderId],
                [fieldId]: {
                    ...(state[formBuilderId] && state[formBuilderId][fieldId]),
                    ...fieldUIUpdates,
                    validatingMessage: message,
                },
            },
        };
    },
}, 'formsSectionsFieldsUI');

export const formsDesc = createReducerDescription({
    [loaderActionTypes.ADD_FORM_DATA]: (state, action) => {
        const payload = action.payload;

        const prevLoadNr = state[payload.formId] && state[payload.formId].loadNr;
        let nextLoadNr;
        if (!prevLoadNr) {
            nextLoadNr = 1;
        } else {
            nextLoadNr = prevLoadNr === 999 ? 1 : prevLoadNr + 1;
        }

        return {
            ...state,
            [payload.formId]: {
                ...state[payload.formId],
                loadNr: nextLoadNr,
            },
        };
    },
}, 'forms');
