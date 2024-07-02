// @flow
import { effectActions } from '@dhis2/rules-engine-javascript';
import type { AssignOutputEffect } from '@dhis2/rules-engine-javascript';
import { createReducerDescription } from '../../trackerRedux';
import { asyncHandlerActionTypes } from '../../components/D2Form';
import { actionTypes as fieldActionTypes } from '../../components/D2Form/D2SectionFields.actions';
import { actionTypes as loaderActionTypes } from '../../components/D2Form/actions/form.actions';
import { actionTypes as formAsyncActionTypes } from '../../components/D2Form/asyncHandlerHOC/actions';
import { actionTypes as formBuilderActionTypes } from '../../components/D2Form/FormBuilder/formBuilder.actions';
import { actionTypes as dataEntryActionTypes } from '../../components/DataEntry/actions/dataEntry.actions';
import { rulesEffectsActionTypes } from '../../rules';
import { actionTypes as orgUnitFormFieldActionTypes } from '../../components/D2Form/field/Components/OrgUnitField/orgUnitFieldForForms.actions';
import { newRelationshipActionTypes } from '../../components/DataEntries/SingleEventRegistrationEntry';
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
    [rulesEffectsActionTypes.UPDATE_RULES_EFFECTS]: (state, action) => {
        const assignEffects: { [id: string]: Array<AssignOutputEffect> } =
            action.payload.rulesEffects && action.payload.rulesEffects[effectActions.ASSIGN_VALUE];
        if (!assignEffects) {
            return state;
        }

        const payload = action.payload;
        const newState = {
            ...state,
            [payload.formId]: {
                ...state[payload.formId],
                ...Object.keys(assignEffects).reduce((acc, id) => {
                    const effectsForId = assignEffects[id];
                    const value = effectsForId[effectsForId.length - 1].value;
                    acc[id] = value;
                    return acc;
                }, {}),
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

        newState[formId] && delete newState[formId];

        return newState;
    },
    [formAsyncActionTypes.FIELDS_VALIDATED]: (state, action) => {
        const newState = { ...state };
        const payload = action.payload;

        newState[payload.formId] = Object.keys(payload.fieldsUI).reduce((accSectionFieldsUI, key) => {
            accSectionFieldsUI[key] = { ...accSectionFieldsUI[key], ...payload.fieldsUI[key], validatingMessage: null };
            return accSectionFieldsUI;
        }, { ...newState[payload.formId] });
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
        const formBuilderFieldsUI = newState[payload.formId];
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
        const { fieldId, formId, message, fieldUIUpdates } = action.payload;
        return {
            ...state,
            [formId]: {
                ...state[formId],
                [fieldId]: {
                    ...(state[formId] && state[formId][fieldId]),
                    ...fieldUIUpdates,
                    validatingMessage: message,
                },
            },
        };
    },
    [loaderActionTypes.FORM_DATA_REMOVE]: removeFormData,
    [newPageActionTypes.CLEAN_UP_DATA_ENTRY]: cleanUp,
    [rulesEffectsActionTypes.UPDATE_RULES_EFFECTS]: (state, action) => {
        const { formId, rulesEffects } = action.payload;
        const formSectionFields = state[formId];
        const assignEffects: { [id: string]: Array<AssignOutputEffect> } =
            rulesEffects && rulesEffects[effectActions.ASSIGN_VALUE];

        if (!assignEffects || !formSectionFields) {
            return state;
        }

        const updatedFields = Object.keys(assignEffects).reduce((acc, id) => {
            if (formSectionFields[id]) {
                acc[id] = {
                    ...state[formId][id],
                    modified: true,
                    touched: true,
                    validatingMessage: null,
                    pendingValidation: true,
                };
            }
            return acc;
        }, {});

        return {
            ...state,
            [formId]: {
                ...state[formId],
                ...updatedFields,
            },
        };
    },
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
