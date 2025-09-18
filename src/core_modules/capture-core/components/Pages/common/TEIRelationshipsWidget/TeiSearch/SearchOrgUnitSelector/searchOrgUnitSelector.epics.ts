import log from 'loglevel';
import isArray from 'd2-utilizr/lib/isArray';
import { from } from 'rxjs';
import { errorCreator } from 'capture-core-utils';
import { ofType } from 'redux-observable';
import { map, concatMap, takeUntil, filter } from 'rxjs/operators';
import {
    actionTypes as teiSearchActionTypes,
} from '../actions/teiSearch.actions';

import {
    actionTypes as searchOrgUnitActionTypes,
    filterOrgUnitsFailed,
    filteredOrgUnitsRetrieved,
} from './searchOrgUnitSelector.actions';

const RETRIEVE_ERROR = 'Could not retrieve organisation unit list';


const isInitializeTeiSearch = (action: any, searchId: string) =>
    action.type === teiSearchActionTypes.INITIALIZE_TEI_SEARCH &&
  action.payload.searchId === searchId;

const isRequestFilterOrgUnits = (action: any, searchId: string) =>
    action.type === searchOrgUnitActionTypes.TEI_SEARCH_REQUEST_FILTER_ORG_UNITS &&
  action.payload.searchId === searchId;


const cancelActionFilter = (action: any, searchId: string) => {
    if (isArray(action.payload)) {
        return action.payload.some((innerAction: any) => isInitializeTeiSearch(innerAction, searchId));
    }
    return isInitializeTeiSearch(action, searchId) || isRequestFilterOrgUnits(action, searchId);
};

export const teiSearchFilterOrgUnitsEpic = (
    action$: any,
    store: any,
    { querySingleResource }: { querySingleResource: any }
) =>
    action$.pipe(
        ofType(searchOrgUnitActionTypes.TEI_SEARCH_REQUEST_FILTER_ORG_UNITS),
        concatMap((action: any) => {
            const searchText = action.payload.searchText;
            const searchId = action.payload.searchId;

            return from(querySingleResource({
                resource: 'organisationUnits',
                params: {
                    fields: [
                        'id,displayName,path,publicAccess,access,lastUpdated',
                        'children[id,displayName,publicAccess,access,path,children::isNotEmpty]',
                    ].join(','),
                    paging: true,
                    withinUserSearchHierarchy: true,
                    query: searchText,
                    pageSize: 15,
                },
            }).then(({ organisationUnits }) => ({ regUnitArray: organisationUnits, searchText, searchId }))
                .catch(error => ({ error, searchId })))
                .pipe(takeUntil(action$.pipe(filter((a: any) => cancelActionFilter(a, searchId)))));
        }), map((resultContainer: any) => {
            if (resultContainer.error) {
                log.error(errorCreator(RETRIEVE_ERROR)(
                    { error: resultContainer.error, method: 'searchRegisteringUnitListEpic' }),
                );
                return filterOrgUnitsFailed(resultContainer.searchId, RETRIEVE_ERROR);
            }

            const regUnits = resultContainer.regUnitArray
                .map((unit: any) => ({
                    id: unit.id,
                    path: unit.path,
                    displayName: unit.displayName,
                }));
            return filteredOrgUnitsRetrieved(resultContainer.searchId, regUnits, resultContainer.searchText);
        }));
