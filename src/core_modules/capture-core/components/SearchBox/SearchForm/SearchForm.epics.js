// @flow
import { ofType } from 'redux-observable';
import { catchError, flatMap, map, startWith, switchMap } from 'rxjs/operators';
import { empty, from, of, EMPTY } from 'rxjs';
import {
    searchBoxActionTypes,
    fallbackSearch,
    showEmptyResultsViewOnSearchBox,
    showErrorViewOnSearchBox,
    showLoadingViewOnSearchBox,
    showSuccessResultsViewOnSearchBox,
    addSuccessResultsViewOnSearchBox,
    showTooManyResultsViewOnSearchBox,
    showFallbackNotEnoughAttributesOnSearchBox,
} from '../SearchBox.actions';
import {
    getTrackedEntityInstances,
} from '../../../trackedEntityInstances/trackedEntityInstanceRequests';
import {
    dataElementTypes,
    getTrackedEntityTypeThrowIfNotFound,
    getTrackerProgramThrowIfNotFound,
} from '../../../metaData';
import { PAGINATION } from '../SearchBox.constants';
import { buildUrlQueryString } from '../../../utils/routing';
import {
    navigateToEnrollmentOverview,
} from '../../../actions/navigateToEnrollmentOverview/navigateToEnrollmentOverview.actions';
import { dataElementConvertFunctions } from './SearchFormElementConverter/SearchFormElementConverter';
import type { QuerySingleResource } from '../../../utils/api/api.types';
import { escapeString } from '../../../utils/escapeString';


const getFiltersForUniqueIdSearchQuery = (formValues) => {
    const fieldId = Object.keys(formValues)[0];
    return [`${fieldId}:eq:${escapeString(formValues[fieldId])}`];
};

const searchViaUniqueIdStream = ({
    queryArgs,
    attributes,
    programId,
    absoluteApiPath,
    querySingleResource,
}: {
    queryArgs: any,
    attributes: any,
    programId?: string,
    absoluteApiPath: string,
    querySingleResource: QuerySingleResource,
}) =>
    from(getTrackedEntityInstances(queryArgs, attributes, absoluteApiPath, querySingleResource)).pipe(
        flatMap(({ trackedEntityInstanceContainers }) => {
            const searchResults = trackedEntityInstanceContainers;
            if (searchResults.length > 0) {
                const { id, tei: { orgUnit: orgUnitId } } = searchResults[0];

                return of(navigateToEnrollmentOverview({
                    teiId: id,
                    orgUnitId,
                    programId,
                }));
            }
            return of(showEmptyResultsViewOnSearchBox());
        }),
        startWith(showLoadingViewOnSearchBox()),
        catchError(() => of(showErrorViewOnSearchBox())),
    );

const getFiltersForAttributesSearchQuery = (formValues, attributes) => Object.keys(formValues)
    .filter(fieldId => formValues[fieldId])
    .filter((fieldId) => {
        if (typeof formValues[fieldId] === 'string') {
            return formValues[fieldId].trim().length > 0;
        }
        return true;
    })
    .map((fieldId) => {
        const dataElement = attributes.find(attribute => attribute.id === fieldId);
        if (formValues[fieldId] && dataElement) {
            const dataElementType = dataElementTypes[dataElement.type];
            // $FlowFixMe - Function does not require arguments if unsupported type
            return dataElementConvertFunctions[dataElementType](formValues[fieldId], dataElement);
        }
        return null;
    });

const handleErrors = ({ httpStatusCode, message }) => {
    if (httpStatusCode === 409 && message === 'maxteicountreached') {
        return of(showTooManyResultsViewOnSearchBox());
    }
    return of(showErrorViewOnSearchBox());
};

const searchViaAttributesStream = ({ queryArgs, attributes, triggeredFrom, absoluteApiPath, querySingleResource }) =>
    from(getTrackedEntityInstances(queryArgs, attributes, absoluteApiPath, querySingleResource)).pipe(
        map(({ trackedEntityInstanceContainers: searchResults, pagingData }) => {
            if (searchResults.length > 0) {
                return showSuccessResultsViewOnSearchBox(
                    searchResults,
                    pagingData.currentPage,
                );
            }

            if (searchResults.length === 0 && triggeredFrom === PAGINATION) {
                return showSuccessResultsViewOnSearchBox(
                    [],
                    pagingData.currentPage,
                );
            }

            return showSuccessResultsViewOnSearchBox(
                searchResults,
                1,
            );
        }),
        startWith(showLoadingViewOnSearchBox()),
        catchError(handleErrors),
    );

export const searchViaUniqueIdOnScopeProgramEpic = (
    action$: InputObservable,
    store: ReduxStore,
    { absoluteApiPath, querySingleResource }: ApiUtils,
) =>
    action$.pipe(
        ofType(searchBoxActionTypes.VIA_UNIQUE_ID_ON_SCOPE_PROGRAM_SEARCH),
        flatMap(({ payload: { formId, programId } }) => {
            const {
                formsValues,
            } = store.value;
            const queryArgs = {
                filter: getFiltersForUniqueIdSearchQuery(formsValues[formId]),
                program: programId,
                pageNumber: 1,
                ouMode: 'ACCESSIBLE',
            };

            const attributes = getTrackerProgramThrowIfNotFound(programId).attributes;

            return searchViaUniqueIdStream({
                queryArgs,
                attributes,
                programId,
                absoluteApiPath,
                querySingleResource,
            });
        }),
    );


export const searchViaUniqueIdOnScopeTrackedEntityTypeEpic = (
    action$: InputObservable,
    store: ReduxStore,
    { absoluteApiPath, querySingleResource }: ApiUtils,
) =>
    action$.pipe(
        ofType(searchBoxActionTypes.VIA_UNIQUE_ID_ON_SCOPE_TRACKED_ENTITY_TYPE_SEARCH),
        flatMap(({ payload: { formId, trackedEntityTypeId } }) => {
            const {
                formsValues,
            } = store.value;
            const queryArgs = {
                filter: getFiltersForUniqueIdSearchQuery(formsValues[formId]),
                trackedEntityType: trackedEntityTypeId,
                pageNumber: 1,
                ouMode: 'ACCESSIBLE',
            };

            const attributes = getTrackedEntityTypeThrowIfNotFound(trackedEntityTypeId).attributes;

            return searchViaUniqueIdStream({
                queryArgs,
                attributes,
                absoluteApiPath,
                querySingleResource,
            });
        }),
    );

export const searchViaAttributesOnScopeProgramEpic = (
    action$: InputObservable,
    store: ReduxStore,
    { absoluteApiPath, querySingleResource }: ApiUtils,
) =>
    action$.pipe(
        ofType(searchBoxActionTypes.VIA_ATTRIBUTES_ON_SCOPE_PROGRAM_SEARCH),
        flatMap(({ payload: { formId, programId, page, triggeredFrom } }) => {
            const { formsValues } = store.value;
            const attributes = getTrackerProgramThrowIfNotFound(programId).attributes;

            const queryArgs = {
                filter: getFiltersForAttributesSearchQuery(formsValues[formId], attributes),
                fields: 'attributes,enrollments,trackedEntity,orgUnit',
                program: programId,
                page,
                pageSize: 5,
                ouMode: 'ACCESSIBLE',
            };

            return searchViaAttributesStream({
                queryArgs,
                attributes,
                triggeredFrom,
                absoluteApiPath,
                querySingleResource,
            });
        }),
    );

export const searchViaAttributesOnScopeTrackedEntityTypeEpic = (
    action$: InputObservable,
    store: ReduxStore,
    { absoluteApiPath, querySingleResource }: ApiUtils,
) =>
    action$.pipe(
        ofType(searchBoxActionTypes.VIA_ATTRIBUTES_ON_SCOPE_TRACKED_ENTITY_TYPE_SEARCH),
        flatMap(({ payload: { formId, trackedEntityTypeId, page, triggeredFrom } }) => {
            const { formsValues } = store.value;
            const attributes = getTrackedEntityTypeThrowIfNotFound(trackedEntityTypeId).attributes;

            const queryArgs = {
                filter: getFiltersForAttributesSearchQuery(formsValues[formId], attributes),
                trackedEntityType: trackedEntityTypeId,
                page,
                pageSize: 5,
                ouMode: 'ACCESSIBLE',
            };

            return searchViaAttributesStream({
                queryArgs,
                attributes,
                triggeredFrom,
                absoluteApiPath,
                querySingleResource,
            });
        }),
    );

export const startFallbackSearchEpic = (action$: InputObservable, store: ReduxStore) =>
    action$.pipe(
        ofType(searchBoxActionTypes.FALLBACK_SEARCH_START),
        flatMap(({ payload: { programId, pageSize, page } }) => {
            const trackerProgram = getTrackerProgramThrowIfNotFound(programId);
            if (trackerProgram.trackedEntityType) {
                const { id: trackedEntityTypeId, searchGroups } = trackerProgram.trackedEntityType;
                const availableSearchGroup = searchGroups.find(group => !group.unique);

                if (availableSearchGroup) {
                    const {
                        minAttributesRequiredToSearch,
                        searchForm,
                    } = availableSearchGroup;
                    const { searchDomain } = store.value;
                    const searchTerms = searchDomain.currentSearchInfo.currentSearchTerms;
                    const searchableFields = searchForm.getElements();

                    const { searchableValuesCount, fallbackFormValues } = searchTerms.reduce((acc, term) => {
                        if (searchableFields.find(({ id }) => id === term.id)) {
                            acc.searchableValuesCount += 1;
                        }
                        acc.fallbackFormValues[term.id] = term.value;
                        return acc;
                    }, { searchableValuesCount: 0, fallbackFormValues: {} });

                    if (!minAttributesRequiredToSearch && !searchableValuesCount) {
                        return of(showFallbackNotEnoughAttributesOnSearchBox({
                            searchableFields, minAttributesRequiredToSearch: 1,
                        }));
                    }

                    if (searchableValuesCount >= minAttributesRequiredToSearch) {
                        return of(fallbackSearch({ trackedEntityTypeId, fallbackFormValues, page, pageSize }));
                    }

                    return of(showFallbackNotEnoughAttributesOnSearchBox({
                        searchableFields, minAttributesRequiredToSearch,
                    }));
                }
                return of(showErrorViewOnSearchBox());
            }

            return empty();
        }),
    );

export const fallbackSearchEpic = (
    action$: InputObservable,
    _: ReduxStore,
    { absoluteApiPath, querySingleResource }: ApiUtils,
) =>
    action$.pipe(
        ofType(searchBoxActionTypes.FALLBACK_SEARCH),
        flatMap(({ payload: { fallbackFormValues, trackedEntityTypeId, pageSize, page } }) => {
            const attributes = getTrackedEntityTypeThrowIfNotFound(trackedEntityTypeId).attributes;
            const filter = getFiltersForAttributesSearchQuery(fallbackFormValues, attributes).filter(query => query);

            const queryArgs = {
                filter,
                trackedEntityType: trackedEntityTypeId,
                page,
                pageSize,
                ouMode: 'ACCESSIBLE',
                fields: 'trackedEntity,trackedEntityType,orgUnit,attributes,enrollments,',
            };


            return from(getTrackedEntityInstances(queryArgs, attributes, absoluteApiPath, querySingleResource)).pipe(
                map(({ trackedEntityInstanceContainers: searchResults, pagingData }) => {
                    if (searchResults.length) {
                        return addSuccessResultsViewOnSearchBox(searchResults, pagingData.currentPage);
                    }
                    return showEmptyResultsViewOnSearchBox();
                }),
                catchError(handleErrors),
            );
        }),
    );

export const fallbackPushPageEpic = (action$: InputObservable, _: ReduxStore, { history }: ApiUtils) =>
    action$.pipe(
        ofType(searchBoxActionTypes.FALLBACK_SEARCH_COMPLETED),
        switchMap(({ payload: { orgUnitId, trackedEntityTypeId } }) => {
            history.push(`/search?${buildUrlQueryString({ orgUnitId, trackedEntityTypeId })}`);
            return EMPTY;
        }),
    );
