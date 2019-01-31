// @flow
import { createReducerDescription } from '../../trackerRedux/trackerReducer';
import { actionTypes as fieldActionTypes } from '../../components/D2Form/D2SectionFields.actions';
import { actionTypes as loaderActionTypes } from '../../components/D2Form/actions/form.actions';
import { actionTypes as formBuilderActionTypes } from '../../components/D2Form/formBuilder.actions';
import { actionTypes as dataEntryActionTypes } from '../../components/DataEntry/actions/dataEntry.actions';
import { actionTypes as rulesEffectsActionTypes } from '../../rulesEngineActionsCreator/rulesEngine.actions';
import { actionTypes as orgUnitFormFieldActionTypes } from '../../components/D2Form/field/Components/OrgUnitField/orgUnitFieldForForms.actions';
import getOrgUnitRootsKey from '../../components/D2Form/field/Components/OrgUnitField/getOrgUnitRootsKey';
import {
    set as setStoreRoots,
} from '../../components/FormFields/New/Fields/OrgUnitField/orgUnitRoots.store';

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
            accSectionFieldsUI[key] = { ...accSectionFieldsUI[key], ...payload.fieldsUI[key] };
            return accSectionFieldsUI;
        }, { ...newState[payload.id] });
        return newState;
    },
    [fieldActionTypes.UPDATE_FIELD]: (state, action) => {
        const newState = { ...state };
        const payload = action.payload;
        newState[payload.sectionId] = { ...newState[payload.sectionId] };
        const sectionFieldsUI = newState[payload.sectionId];
        sectionFieldsUI[payload.elementId] = { ...sectionFieldsUI[payload.elementId], ...payload.uiState, modified: true };
        return newState;
    },
    [dataEntryActionTypes.UPDATE_FORM_FIELD]: (state, action) => {
        const newState = { ...state };
        const payload = action.payload;
        newState[payload.formBuilderId] = { ...newState[payload.formBuilderId] };
        const formBuilderFieldsUI = newState[payload.formBuilderId];
        formBuilderFieldsUI[payload.elementId] = { ...formBuilderFieldsUI[payload.elementId], ...payload.uiState, modified: true };
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
}, 'formsSectionsFieldsUI');


export const formsFieldsMiscDesc = createReducerDescription({
    [loaderActionTypes.ADD_FORM_DATA]: (state, action) => ({
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
}, 'formsFieldsMisc');
