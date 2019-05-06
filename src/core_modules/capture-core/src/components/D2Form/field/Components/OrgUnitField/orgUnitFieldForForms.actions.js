// @flow
import { actionCreator } from '../../../../../actions/actions.utils';

export const actionTypes = {
    REQUEST_FILTER_FORM_FIELD_ORG_UNITS: 'RequestFilterFormFieldOrgUnits',
    FILTERED_FORM_FIELD_ORG_UNITS_RETRIEVED: 'FilteredFormFieldOrgUnitsRetrieved',
    FILTER_FORM_FIELD_ORG_UNITS_FAILED: 'FilterFormFieldOrgUnitsFailed',
    RESET_FORM_FIELD_ORG_UNITS_FILTER: 'ResetFormFieldOrgUnitsFilter',
};


export const requestFilterFormFieldOrgUnits = (formId: string, elementId: string, searchText: string) =>
    actionCreator(actionTypes.REQUEST_FILTER_FORM_FIELD_ORG_UNITS)({ formId, elementId, searchText });

export const filteredFormFieldOrgUnitsRetrieved = (formId: string, elementId: string, roots: Array<Object>) =>
    actionCreator(actionTypes.FILTERED_FORM_FIELD_ORG_UNITS_RETRIEVED)({ formId, elementId, roots });

export const filterFormFieldOrgUnitsFailed = (formId: string, elementId: string, errorMessage: string) =>
    actionCreator(actionTypes.FILTER_FORM_FIELD_ORG_UNITS_FAILED)({ formId, elementId, errorMessage });

export const resetFormFieldOrgUnitsFilter = (formId: string, elementId: string) =>
    actionCreator(actionTypes.RESET_FORM_FIELD_ORG_UNITS_FILTER)({ formId, elementId });
