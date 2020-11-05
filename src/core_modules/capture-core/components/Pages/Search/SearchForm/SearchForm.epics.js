// @flow
import { ofType } from 'redux-observable';
import { catchError, flatMap, map, startWith } from 'rxjs/operators';
import { of, from, empty, concat } from 'rxjs';
import { isObject, isString } from 'd2-utilizr/src';
import { push } from 'connected-react-router';
import {
    searchPageActionTypes,
    fallbackPushPage,
    fallbackSearch,
    saveCurrentSearchInfo,
    showEmptyResultsViewOnSearchPage,
    showErrorViewOnSearchPage,
    showLoadingViewOnSearchPage,
    showSuccessResultsViewOnSearchPage,
} from '../SearchPage.actions';
import { getTrackedEntityInstances } from '../../../../trackedEntityInstances/trackedEntityInstanceRequests';
import {
    scopeTypes,
    getTrackedEntityTypeThrowIfNotFound,
    getTrackerProgramThrowIfNotFound,
} from '../../../../metaData';
import { navigateToTrackedEntityDashboard } from '../sharedUtils';
import { PAGINATION } from '../SearchPage.constants';
import { urlThreeArguments } from '../../../../utils/url';

const getFiltersForUniqueIdSearchQuery = (formValues) => {
    const fieldId = Object.keys(formValues)[0];
    return [`${fieldId}:eq:${formValues[fieldId]}`];
};

const searchViaUniqueIdStream = (queryArgs, attributes, scopeSearchParam) =>
    from(getTrackedEntityInstances(queryArgs, attributes)).pipe(
        flatMap(({ trackedEntityInstanceContainers }) => {
            const searchResults = trackedEntityInstanceContainers;
            if (searchResults.length > 0) {
                const { id, tei: { orgUnit: orgUnitId } } = searchResults[0];
                navigateToTrackedEntityDashboard(id, orgUnitId, scopeSearchParam);
                return empty();
            }
            return of(showEmptyResultsViewOnSearchPage());
        }),
        startWith(showLoadingViewOnSearchPage()),
        catchError(() => of(showErrorViewOnSearchPage())),
    );

const getFiltersForAttributesSearchQuery = (formValues) => {
    const stringFilters = Object.keys(formValues)
        .filter(fieldId => isString(formValues[fieldId]))
        .filter(fieldId => formValues[fieldId].replace(/\s/g, '').length)
        .map(fieldId => `${fieldId}:like:${formValues[fieldId]}`);

    const rangeFilers = Object.keys(formValues)
        .filter(fieldId => isObject(formValues[fieldId]))
        .filter(fieldId => ('from' in formValues[fieldId] && 'to' in formValues[fieldId]))
        .map(fieldId => `${fieldId}:ge:${formValues[fieldId].from}:le:${formValues[fieldId].to}`);

    return [...stringFilters, ...rangeFilers];
};
const searchViaAttributesStream = (queryArgs, attributes, triggeredFrom) =>
    from(getTrackedEntityInstances(queryArgs, attributes)).pipe(
        map(({ trackedEntityInstanceContainers: searchResults, pagingData }) => {
            if (searchResults.length > 0) {
                return showSuccessResultsViewOnSearchPage(
                    searchResults,
                    pagingData.currentPage,
                );
            }

            if (searchResults.length === 0 && triggeredFrom === PAGINATION) {
                return showSuccessResultsViewOnSearchPage(
                    [],
                    pagingData.currentPage,
                );
            }

            return showEmptyResultsViewOnSearchPage();
        }),
        startWith(showLoadingViewOnSearchPage()),
        catchError(() => of(showErrorViewOnSearchPage())),
    );

export const searchViaUniqueIdOnScopeProgramEpic: Epic = (action$, store) =>
    action$.pipe(
        ofType(searchPageActionTypes.VIA_UNIQUE_ID_ON_SCOPE_PROGRAM_SEARCH),
        flatMap(({ payload: { formId, programId } }) => {
            const { formsValues } = store.value;
            const queryArgs = {
                filter: getFiltersForUniqueIdSearchQuery(formsValues[formId]),
                program: programId,
                pageNumber: 1,
                ouMode: 'ACCESSIBLE',
            };

            const attributes = getTrackerProgramThrowIfNotFound(programId).attributes;

            return searchViaUniqueIdStream(queryArgs, attributes, `program=${programId}`);
        }),
    );


export const searchViaUniqueIdOnScopeTrackedEntityTypeEpic: Epic = (action$, store) =>
    action$.pipe(
        ofType(searchPageActionTypes.VIA_UNIQUE_ID_ON_SCOPE_TRACKED_ENTITY_TYPE_SEARCH),
        flatMap(({ payload: { formId, trackedEntityTypeId } }) => {
            const { formsValues } = store.value;
            const queryArgs = {
                filter: getFiltersForUniqueIdSearchQuery(formsValues[formId]),
                trackedEntityType: trackedEntityTypeId,
                pageNumber: 1,
                ouMode: 'ACCESSIBLE',
            };

            const attributes = getTrackedEntityTypeThrowIfNotFound(trackedEntityTypeId).attributes;

            return searchViaUniqueIdStream(queryArgs, attributes, `trackedEntityType=${trackedEntityTypeId}`);
        }),
    );

export const searchViaAttributesOnScopeProgramEpic: Epic = (action$, store) =>
    action$.pipe(
        ofType(searchPageActionTypes.VIA_ATTRIBUTES_ON_SCOPE_PROGRAM_SEARCH),
        flatMap(({ payload: { formId, programId, page, triggeredFrom } }) => {
            const { formsValues } = store.value;

            const queryArgs = {
                filter: getFiltersForAttributesSearchQuery(formsValues[formId]),
                program: programId,
                page,
                pageSize: 5,
                ouMode: 'ACCESSIBLE',
                fields: '*',
            };
            const attributes = getTrackerProgramThrowIfNotFound(programId).attributes;

            return searchViaAttributesStream(queryArgs, attributes, triggeredFrom);
        }),
    );

export const searchViaAttributesOnScopeTrackedEntityTypeEpic: Epic = (action$, store) =>
    action$.pipe(
        ofType(searchPageActionTypes.VIA_ATTRIBUTES_ON_SCOPE_TRACKED_ENTITY_TYPE_SEARCH),
        flatMap(({ payload: { formId, trackedEntityTypeId, page, triggeredFrom } }) => {
            const { formsValues } = store.value;

            const queryArgs = {
                filter: getFiltersForAttributesSearchQuery(formsValues[formId]),
                trackedEntityType: trackedEntityTypeId,
                page,
                pageSize: 5,
                ouMode: 'ACCESSIBLE',
            };

            const attributes = getTrackedEntityTypeThrowIfNotFound(trackedEntityTypeId).attributes;

            return searchViaAttributesStream(queryArgs, attributes, triggeredFrom);
        }),
    );

const deriveSearchFormInfo = searchGroups => (searchGroups.filter(searchGroup => !searchGroup.unique)[0] || {});

// falling back from a search into a Program to a search into TEType means that
// sometimes there wil be less attributes to search with. For instance a program
// can have attributes last name, first name and gender but a TETYpe will have
// only first name. Here we derive the form values that are revelant.
const deriveFormValues = (searchForm, values) => {
    if (!searchForm) {
        return {};
    }
    const elements = searchForm.getElements();

    return ([...elements.values()].reduce((acc, { id: fieldId }) => {
        if (Object.keys(values).includes(fieldId)) {
            const fieldValue = values[fieldId];
            return { ...acc, [fieldId]: fieldValue };
        }
        return acc;
    }, {}));
};

const deriveCurrentFallbackSearchTerms = (searchTermsFromOriginalSearch, fallbackFormValues) =>
    searchTermsFromOriginalSearch.filter(({ id }) => Object.keys(fallbackFormValues).includes(id));

export const startFallbackSearchEpic = (action$: InputObservable, store: ReduxStore) =>
    action$.pipe(
        ofType(searchPageActionTypes.FALLBACK_SEARCH_START),
        flatMap(({ payload: { formId, programId, pageSize, availableSearchOptions } }) => {
            const trackerProgram = getTrackerProgramThrowIfNotFound(programId);
            if (trackerProgram.trackedEntityType) {
                const { orgUnitId } = store.value.currentSelections;

                const { id: trackedEntityTypeId } = trackerProgram.trackedEntityType;
                const { formsValues, searchPage: { currentSearchInfo: { currentSearchTerms: searchTermsFromOriginalSearch } } } = store.value;

                const { searchForm, formId: fallbackFormId } = deriveSearchFormInfo(availableSearchOptions[trackedEntityTypeId].searchGroups);
                const fallbackFormValues = deriveFormValues(searchForm, formsValues[formId]);
                const fallbackSearchTerms = deriveCurrentFallbackSearchTerms(searchTermsFromOriginalSearch, fallbackFormValues);

                return concat(
                    of(fallbackPushPage({ orgUnitId, trackedEntityTypeId })),
                    of(fallbackSearch({ trackedEntityTypeId, fallbackFormValues, pageSize })),
                    of(saveCurrentSearchInfo({
                        formId: fallbackFormId,
                        currentSearchTerms: fallbackSearchTerms,
                        searchScopeType: scopeTypes.TRACKED_ENTITY_TYPE,
                        searchScopeId: trackedEntityTypeId,
                    })),
                );
            }

            return empty();
        }),
    );

export const fallbackSearchEpic: Epic = (action$: InputObservable) =>
    action$.pipe(
        ofType(searchPageActionTypes.FALLBACK_SEARCH),
        flatMap(({ payload: { fallbackFormValues, trackedEntityTypeId, pageSize, page } }) => {
            const filter = getFiltersForAttributesSearchQuery(fallbackFormValues);
            const queryArgs = {
                filter,
                trackedEntityType: trackedEntityTypeId,
                page,
                pageSize,
                ouMode: 'ACCESSIBLE',
            };

            const attributes = getTrackedEntityTypeThrowIfNotFound(trackedEntityTypeId).attributes;

            return from(getTrackedEntityInstances(queryArgs, attributes)).pipe(
                map(({ trackedEntityInstanceContainers: searchResults, pagingData }) => {
                    if (searchResults.length > 0) {
                        return showSuccessResultsViewOnSearchPage(searchResults, pagingData.currentPage);
                    }

                    return of(showEmptyResultsViewOnSearchPage());
                }),
                startWith(showLoadingViewOnSearchPage()),
                catchError(() => of(showErrorViewOnSearchPage())),
            );
        }),
    );

export const fallbackPushPageEpic = (action$: InputObservable) =>
    action$.pipe(
        ofType(searchPageActionTypes.FALLBACK_SEARCH_COMPLETED),
        map(({ payload: { orgUnitId, trackedEntityTypeId } }) =>
            push(urlThreeArguments({ orgUnitId, trackedEntityTypeId }))),
    );
