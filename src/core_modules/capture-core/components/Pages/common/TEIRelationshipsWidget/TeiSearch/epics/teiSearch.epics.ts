import { ofType } from 'redux-observable';
import { map, switchMap, catchError, takeUntil } from 'rxjs/operators';
import { EMPTY, of } from 'rxjs';
import log from 'loglevel';
import { errorCreator } from '../../../../../../actions/actions.utils';
import {
    searchTeiFailed,
    searchTeiResultRetrieved,
    searchTeiResultCountRetrieved,
    searchTeiResultCountFailed,
} from '../actions/teiSearch.actions';


export const searchTeiByTETIdEpic = (
    action$: any,
    store: any,
) =>
    action$.pipe(
        ofType('RequestSearchTei'),
        map((action: any) => action.payload),
        switchMap(({ formId, searchGroupId, searchId }: any) => {
            const state = store.value;
            const currentTeiSearch = state.teiSearch?.[searchId] || {};
            const { selectedOrgUnit, selectedOrgUnitScope } = currentTeiSearch;

            if (!selectedOrgUnit && selectedOrgUnitScope !== 'ACCESSIBLE') {
                return of(searchTeiFailed(formId, searchGroupId, searchId));
            }

            return Promise.resolve([])
                .then(clientTeis => searchTeiResultRetrieved(clientTeis, formId, searchGroupId, searchId))
                .catch((error) => {
                    log.error(errorCreator('An error occurred when searching for tracked entity instances')({ error, method: 'searchTeiByTETIdEpic' }));
                    return searchTeiFailed(formId, searchGroupId, searchId);
                });
        }),
        switchMap((actionObservable: any) => actionObservable),
        takeUntil(action$.pipe(ofType('SearchTeiResultReset', 'SearchTeiResultResetAll'))),
        catchError((error: any) => {
            log.error(errorCreator('An error occurred in searchTeiByTETIdEpic')({ error }));
            return EMPTY;
        }),
    );

export const searchViaUniqueIdOnScopeTrackedEntityTypeEpic = (action$: any, store: any) =>
    action$.pipe(
        ofType('SearchViaUniqueIdOnScopeTrackedEntityType'),
        map((action: any) => action.payload),
        switchMap(({ formId, searchGroupId, searchId }: any) => {
            const state = store.value;
            const currentTeiSearch = state.teiSearch?.[searchId] || {};
            const { selectedOrgUnit, selectedOrgUnitScope } = currentTeiSearch;

            if (!selectedOrgUnit && selectedOrgUnitScope !== 'ACCESSIBLE') {
                return of(searchTeiFailed(formId, searchGroupId, searchId));
            }

            return Promise.resolve([])
                .then(clientTeis => searchTeiResultRetrieved(clientTeis, formId, searchGroupId, searchId))
                .catch((error) => {
                    log.error(errorCreator('An error occurred when searching for tracked entity instances')({ error, method: 'searchViaUniqueIdOnScopeTrackedEntityTypeEpic' }));
                    return searchTeiFailed(formId, searchGroupId, searchId);
                });
        }),
        switchMap((actionObservable: any) => actionObservable),
        takeUntil(action$.pipe(ofType('SearchTeiResultReset', 'SearchTeiResultResetAll'))),
        catchError((error: any) => {
            log.error(errorCreator('An error occurred in searchViaUniqueIdOnScopeTrackedEntityTypeEpic')({ error }));
            return EMPTY;
        }),
    );

export const requestSearchTeiResultCountEpic = (action$: any, store: any) =>
    action$.pipe(
        ofType('RequestSearchTeiResultCount'),
        map((action: any) => action.payload),
        switchMap(({ formId, searchGroupId, searchId }: any) => {
            const state = store.value;
            const currentTeiSearch = state.teiSearch?.[searchId] || {};
            const { selectedOrgUnit, selectedOrgUnitScope } = currentTeiSearch;

            if (!selectedOrgUnit && selectedOrgUnitScope !== 'ACCESSIBLE') {
                return of(searchTeiResultCountFailed(formId, searchGroupId, searchId));
            }

            return Promise.resolve(0)
                .then(count => searchTeiResultCountRetrieved(count, formId, searchGroupId, searchId))
                .catch((error) => {
                    log.error(errorCreator('An error occurred when getting count of tracked entity instances')({ error, method: 'requestSearchTeiResultCountEpic' }));
                    return searchTeiResultCountFailed(formId, searchGroupId, searchId);
                });
        }),
        switchMap((actionObservable: any) => actionObservable),
        takeUntil(action$.pipe(ofType('SearchTeiResultReset', 'SearchTeiResultResetAll'))),
        catchError((error: any) => {
            log.error(errorCreator('An error occurred in requestSearchTeiResultCountEpic')({ error }));
            return EMPTY;
        }),
    );
