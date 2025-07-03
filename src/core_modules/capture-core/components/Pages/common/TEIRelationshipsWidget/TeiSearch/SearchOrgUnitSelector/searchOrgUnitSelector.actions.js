import { actionCreator } from '../../../../../../actions/actions.utils';

export const actionTypes = {
    TEI_SEARCH_REQUEST_FILTER_ORG_UNITS: 'TeiSearchRequestFilterOrgUnits',
    TEI_SEARCH_CLEAR_ORG_UNITS_FILTER: 'TeiSearchClearOrgUnitsFilter',
    TEI_SEARCH_FILTERED_ORG_UNITS_RETRIEVED: 'TeiSearchFilteredOrgUnitsRetrieved',
    TEI_SEARCH_FILTER_ORG_UNITS_FAILED: 'TeiSearchFilterOrgUnitsFailed',
    TEI_SEARCH_SET_ORG_UNIT_SCOPE: 'TeiSearchSetOrgUnitScope',
    TEI_SEARCH_SET_ORG_UNIT: 'TeiSearchSetOrgUnit',
};

export const setOrgUnitScope = (searchId, orgUnitScope) =>
    actionCreator(actionTypes.TEI_SEARCH_SET_ORG_UNIT_SCOPE)({ searchId, orgUnitScope });

export const setOrgUnit = (searchId, orgUnit) =>
    actionCreator(actionTypes.TEI_SEARCH_SET_ORG_UNIT)({ searchId, orgUnit });

export const requestFilterOrgUnits = (searchId, searchText) =>
    actionCreator(actionTypes.TEI_SEARCH_REQUEST_FILTER_ORG_UNITS)({ searchId, searchText });

export const filteredOrgUnitsRetrieved = (searchId, roots, searchText) =>
    actionCreator(actionTypes.TEI_SEARCH_FILTERED_ORG_UNITS_RETRIEVED)({ searchId, roots, searchText });

export const filterOrgUnitsFailed = (searchId, error) =>
    actionCreator(actionTypes.TEI_SEARCH_FILTER_ORG_UNITS_FAILED)({ searchId, error });

export const clearOrgUnitsFilter = (searchId) =>
    actionCreator(actionTypes.TEI_SEARCH_CLEAR_ORG_UNITS_FILTER)({ searchId });
