// @flow
import { effectActions } from '../../rules/engine';
import type { OutputEffect } from '../../rules/engine';
import { createReducerDescription } from '../../trackerRedux/trackerReducer';
import { asyncHandlerActionTypes } from '../../components/D2Form';
import { actionTypes as fieldActionTypes } from '../../components/D2Form/D2SectionFields.actions';
import { actionTypes as loaderActionTypes } from '../../components/D2Form/actions/form.actions';
import { actionTypes as formAsyncActionTypes } from '../../components/D2Form/asyncHandlerHOC/actions';
import { actionTypes as formBuilderActionTypes } from '../../components/D2Form/formBuilder.actions';
import { actionTypes as dataEntryActionTypes } from '../../components/DataEntry/actions/dataEntry.actions';
import { actionTypes as rulesEffectsActionTypes } from '../../rules/actionsCreator';
import { actionTypes as orgUnitFormFieldActionTypes } from '../../components/D2Form/field/Components/OrgUnitField/orgUnitFieldForForms.actions';
import { newRelationshipActionTypes } from '../../components/DataEntries/SingleEventRegistrationEntry';
import { getOrgUnitRootsKey } from '../../components/D2Form/field/Components/OrgUnitField/getOrgUnitRootsKey';
import {
    set as setStoreRoots,
} from '../../components/FormFields/New/Fields/OrgUnitField/orgUnitRoots.store';
import { newPageActionTypes } from '../../components/Pages/New/NewPage.actions';

const removeFormData = (state, { payload: { formId } }) => {
    const remainingKeys = Object.keys(state).filter(key => !key.includes(formId));
    return remainingKeys.reduce((acc, key) => ({ ...acc, [key]: state[key] }), {});
};

// cleans up data entries that _start with_ dataEntryId
const cleanUp = (state, { payload: { dataEntryId } }) => {
    const newState = Object.keys(state).reduce((acc, curr) =>
        (curr.startsWith(dataEntryId) ? { ...acc, [curr]: {} } : { ...acc, [curr]: state[curr] }),
    {});

    return newState;
};

export const formsValuesDesc = createReducerDescription({
    [loaderActionTypes.FORM_DATA_ADD]: (state, action) => {
        const newState = { ...state };
        const payload = action.payload;
        newState[payload.formId] = payload.formValues;
        return newState;
    },
    [fieldActionTypes.UPDATE_FIELD]: (state, action) => {
        const newState = { ...state };
        const payload = action.payload;
        // todo (eslint)
        // eslint-disable-next-line no-multi-assign
        const formValues = newState[payload.formId] = { ...newState[payload.formId] };
        formValues[payload.elementId] = payload.value;
        return newState;
    },
    [asyncHandlerActionTypes.UPDATE_FIELD_FROM_ASYNC]: (state, action) => {
        const { formId, elementId, value } = action.payload;
        return {
            ...state,
            [formId]: {
                ...state[formId],
                [elementId]: value,
            },
        };
    },
    [dataEntryActionTypes.UPDATE_FORM_FIELD]: (state, action) => {
        const newState = { ...state };
        const payload = action.payload;
        // todo (eslint)
        // eslint-disable-next-line no-multi-assign
        const formValues = newState[payload.formId] = { ...newState[payload.formId] };
        formValues[payload.elementId] = payload.value;
        return newState;
    },
    [rulesEffectsActionTypes.UPDATE_FIELD_FROM_RULE_EFFECT]: (state, action) => {
        const newState = { ...state };
        const payload = action.payload;
        // todo (eslint)
        // eslint-disable-next-line no-multi-assign
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
    [loaderActionTypes.FORM_DATA_REMOVE]: removeFormData,
    [newPageActionTypes.CLEAN_UP_DATA_ENTRY]: cleanUp,
    [newRelationshipActionTypes.NEW_EVENT_CANCEL_NEW_RELATIONSHIP]: cleanUp,
}, 'formsValues');

export const formsSectionsFieldsUIDesc = createReducerDescription({
    [loaderActionTypes.FORM_DATA_ADD]: (state, action) => {
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
    [formAsyncActionTypes.FIELDS_VALIDATED]: (state, action) => {
        const newState = { ...state };
        const payload = action.payload;

        newState[payload.formBuilderId] = Object.keys(payload.fieldsUI).reduce((accSectionFieldsUI, key) => {
            accSectionFieldsUI[key] = { ...accSectionFieldsUI[key], ...payload.fieldsUI[key], validatingMessage: null };
            return accSectionFieldsUI;
        }, { ...newState[payload.formBuilderId] });
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
    [asyncHandlerActionTypes.START_UPDATE_FIELD_ASYNC]: (state, action) => {
        const { formBuilderId, elementId } = action.payload;
        return {
            ...state,
            [formBuilderId]: {
                ...state[formBuilderId],
                [elementId]: {
                    ...(state[formBuilderId] && state[formBuilderId][elementId]),
                    loading: true,
                },
            },
        };
    },
    [asyncHandlerActionTypes.UPDATE_FIELD_FROM_ASYNC]: (state, action) => {
        const { uiState, formBuilderId, elementId } = action.payload;
        return {
            ...state,
            [formBuilderId]: {
                ...state[formBuilderId],
                [elementId]: {
                    ...(state[formBuilderId] && state[formBuilderId][elementId]),
                    ...uiState,
                    modified: true,
                    validatingMessage: null,
                    loading: false,
                },
            },
        };
    },
    [asyncHandlerActionTypes.ASYNC_UPDATE_FIELD_FAILED]: (state, action) => {
        const { uiState, formBuilderId, elementId, errorMessage } = action.payload;
        return {
            ...state,
            [formBuilderId]: {
                ...state[formBuilderId],
                [elementId]: {
                    ...(state[formBuilderId] && state[formBuilderId][elementId]),
                    ...uiState,
                    modified: true,
                    validatingMessage: null,
                    loading: false,
                    warning: errorMessage,
                },
            },
        };
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
    [formAsyncActionTypes.FIELD_IS_VALIDATING]: (state, action) => {
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
    [loaderActionTypes.FORM_DATA_REMOVE]: removeFormData,
    [newPageActionTypes.CLEAN_UP_DATA_ENTRY]: cleanUp,
}, 'formsSectionsFieldsUI');

export const formsDesc = createReducerDescription({
    [loaderActionTypes.FORM_DATA_ADD]: (state, action) => {
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
    [loaderActionTypes.FORM_DATA_REMOVE]: removeFormData,
}, 'forms');

export const formsFieldsMiscDesc = createReducerDescription({
    [loaderActionTypes.FORM_DATA_ADD]: (state, action) => ({
        ...state,
        [action.payload.formId]: {},
    }),
    [orgUnitFormFieldActionTypes.REQUEST_FILTER_FORM_FIELD_ORG_UNITS]: (state, action) => {
        const { formId, elementId, searchText } = action.payload;
        return {
            ...state,
            [formId]: {
                ...state[formId],
                [elementId]: {
                    ...state[formId][elementId],
                    orgUnitsLoading: true,
                    orgUnitsSearchText: searchText,
                },
            },
        };
    },
    [orgUnitFormFieldActionTypes.FILTERED_FORM_FIELD_ORG_UNITS_RETRIEVED]: (state, action) => {
        const { formId, elementId, roots } = action.payload;
        return {
            ...state,
            [formId]: {
                ...state[formId],
                [elementId]: {
                    ...state[formId][elementId],
                    orgUnitsLoading: false,
                    orgUnitsRoots: roots,
                },
            },
        };
    },
    [orgUnitFormFieldActionTypes.FILTER_FORM_FIELD_ORG_UNITS_FAILED]: (state, action) => {
        const { formId, elementId } = action.payload;
        return {
            ...state,
            [formId]: {
                ...state[formId],
                [elementId]: {
                    ...state[formId][elementId],
                    orgUnitsLoading: false,
                },
            },
        };
    },
    [orgUnitFormFieldActionTypes.RESET_FORM_FIELD_ORG_UNITS_FILTER]: (state, action) => {
        const { formId, elementId } = action.payload;
        setStoreRoots(getOrgUnitRootsKey(formId, elementId), null);
        return {
            ...state,
            [formId]: {
                ...state[formId],
                [elementId]: {
                    ...state[formId][elementId],
                    orgUnitsLoading: false,
                    orgUnitsRoots: null,
                    orgUnitsSearchText: null,
                },
            },
        };
    },
    [loaderActionTypes.FORM_DATA_REMOVE]: removeFormData,
}, 'formsFieldsMisc');
