import { ofType } from 'redux-observable';
import { catchError, flatMap, map, startWith, switchMap } from 'rxjs/operators';
import { empty, from, of, EMPTY } from 'rxjs';
import { featureAvailable, FEATURES } from 'capture-core-utils';
import type { ApiUtils, EpicAction, ReduxStore } from 'capture-core-utils/types';
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
    searchViaUniqueIdOnScopeTrackedEntityType,
} from '../SearchBox.actions';
import {
    getTrackedEntityInstances,
} from '../../../trackedEntityInstances/trackedEntityInstanceRequests';
import {
    getTrackedEntityTypeThrowIfNotFound,
    getTrackerProgramThrowIfNotFound,
    type DataElement,
} from '../../../metaData';
import { PAGINATION } from '../SearchBox.constants';
import { buildUrlQueryString } from '../../../utils/routing';
import {
    navigateToEnrollmentOverview,
} from '../../../actions/navigateToEnrollmentOverview/navigateToEnrollmentOverview.actions';
import { convertSearchFormToServer } from '../../../converters';
import type { QuerySingleResource } from '../../../utils/api/api.types';
import { escapeString } from '../../../utils/escapeString';
import { DEFAULT_IS_UNIQUE_SEARCH_OPERATOR } from '../../../metaDataMemoryStoreBuilders';

const getFiltersForUniqueIdSearchQuery = (formValues: any) => {
    const fieldId = Object.keys(formValues)[0];
    return [`${fieldId}:${DEFAULT_IS_UNIQUE_SEARCH_OPERATOR.toLowerCase()}:${escapeString(formValues[fieldId])}`];
};

const searchViaUniqueIdStream = ({
    queryArgs,
    attributes,
    programId,
    absoluteApiPath,
    querySingleResource,
    formId,
    programTETId,
}: {
    queryArgs: any;
    attributes: any;
    programId?: string;
    absoluteApiPath: string;
    querySingleResource: QuerySingleResource;
    formId?: string;
    programTETId?: string;
}) =>
    from(getTrackedEntityInstances(
        queryArgs, attributes, absoluteApiPath, querySingleResource, programId || undefined,
    )).pipe(
        flatMap(({ trackedEntityInstanceContainers }) => {
            const searchResults = trackedEntityInstanceContainers;
            if (searchResults.length === 0 && queryArgs.program) {
                return of(searchViaUniqueIdOnScopeTrackedEntityType({
                    trackedEntityTypeId: programTETId ?? '', formId: formId ?? '', programId,
                }));
            }
            if (searchResults.length > 0) {
                const { id, tei: { orgUnit: orgUnitId, enrollments } } = searchResults[0];
                const programToNavigateTo = enrollments?.length === 1 && !programId
                    ? enrollments[0].program
                    : programId;

                return of(navigateToEnrollmentOverview({
                    teiId: id,
                    orgUnitId,
                    programId: programToNavigateTo,
                }));
            }
            return of(showEmptyResultsViewOnSearchBox());
        }),
        startWith(showLoadingViewOnSearchBox()),
        catchError(() => of(showErrorViewOnSearchBox())),
    );

const getFiltersForAttributesSearchQuery =
(formValues: any, attributes: any, searchGroupElements?: DataElement[]) => Object.keys(formValues)
    .filter(fieldId => formValues[fieldId])
    .filter((fieldId) => {
        if (typeof formValues[fieldId] === 'string') {
            return formValues[fieldId].trim().length > 0;
        }
        return true;
    })
    .map((fieldId) => {
        const dataElement = attributes.find((attribute: any) => attribute.id === fieldId);
        const searchGroupElement = searchGroupElements?.find((element: any) => element.id === fieldId);
        if (formValues[fieldId] && dataElement && searchGroupElement) {
            const searchOperator = searchGroupElement.searchOperator;

            return convertSearchFormToServer(formValues[fieldId], dataElement, searchOperator);
        }
        return null;
    });

const handleErrors = ({ httpStatusCode, message }: any) => {
    if (httpStatusCode === 409 && message === 'maxteicountreached') {
        return of(showTooManyResultsViewOnSearchBox());
    }
    return of(showErrorViewOnSearchBox());
};

const searchViaAttributesStream = ({
    queryArgs,
    attributes,
    triggeredFrom,
    absoluteApiPath,
    querySingleResource,
    programId,
}: {
    queryArgs: any;
    attributes: any;
    triggeredFrom: string;
    absoluteApiPath: string;
    querySingleResource: QuerySingleResource;
    programId?: string;
}) =>
    from(getTrackedEntityInstances(
        queryArgs, attributes, absoluteApiPath, querySingleResource, programId || undefined,
    )).pipe(
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
    action$: EpicAction<any>,
    store: ReduxStore,
    { absoluteApiPath, querySingleResource }: ApiUtils,
) =>
    action$.pipe(
        ofType(searchBoxActionTypes.VIA_UNIQUE_ID_ON_SCOPE_PROGRAM_SEARCH),
        flatMap(({ payload: { formId, programId } }: any) => {
            const {
                formsValues,
            } = store.value;
            const orgUnitModeQueryParam: string = featureAvailable(FEATURES.newOrgUnitModeQueryParam)
                ? 'orgUnitMode'
                : 'ouMode';
            const queryArgs = {
                filter: getFiltersForUniqueIdSearchQuery(formsValues[formId]),
                program: programId,
                pageNumber: 1,
                [orgUnitModeQueryParam]: 'ACCESSIBLE',
            };

            const { attributes, trackedEntityType } = getTrackerProgramThrowIfNotFound(programId);

            return searchViaUniqueIdStream({
                queryArgs,
                attributes,
                programId,
                absoluteApiPath,
                querySingleResource,
                formId,
                programTETId: trackedEntityType.id,
            });
        }),
    );

export const searchViaUniqueIdOnScopeTrackedEntityTypeEpic = (
    action$: EpicAction<any>,
    store: ReduxStore,
    { absoluteApiPath, querySingleResource }: ApiUtils,
) =>
    action$.pipe(
        ofType(searchBoxActionTypes.VIA_UNIQUE_ID_ON_SCOPE_TRACKED_ENTITY_TYPE_SEARCH),
        flatMap(({ payload: { formId, trackedEntityTypeId, programId } }: any) => {
            const {
                formsValues,
            } = store.value;
            const orgUnitModeQueryParam: string = featureAvailable(FEATURES.newOrgUnitModeQueryParam)
                ? 'orgUnitMode'
                : 'ouMode';
            const queryArgs = {
                filter: getFiltersForUniqueIdSearchQuery(formsValues[formId]),
                trackedEntityType: trackedEntityTypeId,
                pageNumber: 1,
                [orgUnitModeQueryParam]: 'ACCESSIBLE',
                fields: 'trackedEntity,trackedEntityType,orgUnit,attributes,enrollments',
            };

            const attributes = getTrackedEntityTypeThrowIfNotFound(trackedEntityTypeId).attributes;

            return searchViaUniqueIdStream({
                queryArgs,
                attributes,
                programId,
                absoluteApiPath,
                querySingleResource,
            });
        }),
    );

export const searchViaAttributesOnScopeProgramEpic = (
    action$: EpicAction<any>,
    store: ReduxStore,
    { absoluteApiPath, querySingleResource }: ApiUtils,
) =>
    action$.pipe(
        ofType(searchBoxActionTypes.VIA_ATTRIBUTES_ON_SCOPE_PROGRAM_SEARCH),
        flatMap(({ payload: { formId, programId, page, triggeredFrom } }: any) => {
            const { formsValues } = store.value;
            const { searchGroups, attributes } = getTrackerProgramThrowIfNotFound(programId);
            const availableSearchGroup = searchGroups.find((group: any) => !group.unique);

            const orgUnitModeQueryParam: string = featureAvailable(FEATURES.newOrgUnitModeQueryParam)
                ? 'orgUnitMode'
                : 'ouMode';
            const queryArgs = {
                filter: getFiltersForAttributesSearchQuery(
                    formsValues[formId],
                    attributes,
                    availableSearchGroup?.searchForm.getElements(),
                ),
                fields: 'attributes,enrollments,trackedEntity,orgUnit',
                program: programId,
                page,
                pageSize: 5,
                [orgUnitModeQueryParam]: 'ACCESSIBLE',
            };

            return searchViaAttributesStream({
                queryArgs,
                attributes,
                triggeredFrom,
                absoluteApiPath,
                querySingleResource,
                programId,
            });
        }),
    );

export const searchViaAttributesOnScopeTrackedEntityTypeEpic = (
    action$: EpicAction<any>,
    store: ReduxStore,
    { absoluteApiPath, querySingleResource }: ApiUtils,
) =>
    action$.pipe(
        ofType(searchBoxActionTypes.VIA_ATTRIBUTES_ON_SCOPE_TRACKED_ENTITY_TYPE_SEARCH),
        flatMap(({ payload: { formId, trackedEntityTypeId, page, triggeredFrom } }: any) => {
            const { formsValues } = store.value;
            const { attributes, searchGroups } = getTrackedEntityTypeThrowIfNotFound(trackedEntityTypeId);
            const availableSearchGroup = searchGroups.find((group: any) => !group.unique);

            const orgUnitModeQueryParam: string = featureAvailable(FEATURES.newOrgUnitModeQueryParam)
                ? 'orgUnitMode'
                : 'ouMode';
            const queryArgs = {
                filter: getFiltersForAttributesSearchQuery(
                    formsValues[formId],
                    attributes,
                    availableSearchGroup?.searchForm.getElements(),
                ),
                trackedEntityType: trackedEntityTypeId,
                page,
                pageSize: 5,
                [orgUnitModeQueryParam]: 'ACCESSIBLE',
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

export const startFallbackSearchEpic = (action$: EpicAction<any>, store: ReduxStore) =>
    action$.pipe(
        ofType(searchBoxActionTypes.FALLBACK_SEARCH_START),
        flatMap(({ payload: { programId, pageSize, page } }: any) => {
            const trackerProgram = getTrackerProgramThrowIfNotFound(programId);
            if (trackerProgram.trackedEntityType) {
                const { id: trackedEntityTypeId, searchGroups } = trackerProgram.trackedEntityType;
                const availableSearchGroup = searchGroups.find((group: any) => !group.unique);

                if (availableSearchGroup) {
                    const {
                        minAttributesRequiredToSearch,
                        searchForm,
                    } = availableSearchGroup;
                    const { searchDomain } = store.value;
                    const searchTerms = searchDomain.currentSearchInfo.currentSearchTerms;
                    const searchableFields = searchForm.getElements();

                    const { searchableValuesCount, fallbackFormValues } = searchTerms.reduce((acc: any, term: any) => {
                        if (searchableFields.find(({ id }: any) => id === term.id)) {
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
    action$: EpicAction<any>,
    _: ReduxStore,
    { absoluteApiPath, querySingleResource }: ApiUtils,
) =>
    action$.pipe(
        ofType(searchBoxActionTypes.FALLBACK_SEARCH),
        flatMap(({ payload: { fallbackFormValues, trackedEntityTypeId, pageSize, page } }: any) => {
            const { attributes, searchGroups } = getTrackedEntityTypeThrowIfNotFound(trackedEntityTypeId);
            const availableSearchGroup = searchGroups.find((group: any) => !group.unique);

            const filter = getFiltersForAttributesSearchQuery(
                fallbackFormValues, // DHIS2-20530 - TODO the fallback value are not in form shape the convertars should not be applied
                attributes,
                availableSearchGroup?.searchForm.getElements(),
            ).filter((query: any) => query);
            const orgUnitModeQueryParam: string = featureAvailable(FEATURES.newOrgUnitModeQueryParam)
                ? 'orgUnitMode'
                : 'ouMode';
            const queryArgs = {
                filter,
                trackedEntityType: trackedEntityTypeId,
                page,
                pageSize,
                [orgUnitModeQueryParam]: 'ACCESSIBLE',
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

export const fallbackPushPageEpic = (action$: EpicAction<any>, _: ReduxStore, { navigate }: ApiUtils) =>
    action$.pipe(
        ofType(searchBoxActionTypes.FALLBACK_SEARCH_COMPLETED),
        switchMap(({ payload: { orgUnitId, trackedEntityTypeId } }: any) => {
            navigate(`/search?${buildUrlQueryString({ orgUnitId, trackedEntityTypeId })}`);
            return EMPTY;
        }),
    );
