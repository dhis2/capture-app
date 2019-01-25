// @flow

import { actionCreator } from '../../../actions/actions.utils';

export const actionTypes = {
    TEI_SEARCH_SEARCH_ORG_UNITS: 'TeiSearchSearchOrgUnits',
    TEI_SEARCH_CLEAR_ORG_UNITS_SEARCH: 'TeiSearchClearOrgunitsSearch',
    TEI_SEARCH_SET_SEARCH_ORG_UNIT_RESULTS: 'TeiSearchSetSearchOrgUnitResults',
    TEI_SEARCH_SET_SEARCH_ORG_UNIT_RESULTS_FAILED: 'TeiSearchSetSearchOrgUnitResultsFailed',
    TEI_SEARCH_SET_ORG_UNIT_SCOPE: 'TeiSearchSetOrgUnitScope',
    TEI_SEARCH_SET_ORG_UNIT: 'TeiSearchSetOrgUnit',
    TEI_SEARCH_SET_ORG_UNIT_SEARCH_TEXT: 'TeiSearchSetOrgUnitSearchText',
};

export const setOrgUnitScope = (searchId: string, orgUnitScope: string) =>
    actionCreator(actionTypes.TEI_SEARCH_SET_ORG_UNIT_SCOPE)({ searchId, orgUnitScope });

export const setOrgUnit = (searchId: string, orgUnit: ?any) =>
    actionCreator(actionTypes.TEI_SEARCH_SET_ORG_UNIT)({ searchId, orgUnit });

export const searchOrgUnits = (searchId: string, searchText: string) =>
    actionCreator(actionTypes.TEI_SEARCH_SEARCH_ORG_UNITS)({ searchId, searchText });

export const clearOrgUnitsSearch = (searchId: string) =>
    actionCreator(actionTypes.TEI_SEARCH_CLEAR_ORG_UNITS_SEARCH)({ searchId });

export const setSearchOrgUnitResults = (searchId: string, roots: ?Array<any>, searchText: string) =>
    actionCreator(actionTypes.TEI_SEARCH_SET_SEARCH_ORG_UNIT_RESULTS)({ searchId, roots, searchText });

export const setSearchOrgUnitResultsFailed = (searchId: string, error: any) =>
    actionCreator(actionTypes.TEI_SEARCH_SET_SEARCH_ORG_UNIT_RESULTS_FAILED)({ searchId, error });

export const teiSearchSetOrgUnitSearchText = (searchId: string, searchText: string) =>
    actionCreator(actionTypes.TEI_SEARCH_SET_ORG_UNIT_SEARCH_TEXT)({ searchId, searchText });
