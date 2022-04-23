// @flow
import { ofType } from 'redux-observable';
import { catchError, flatMap, map, startWith, switchMap } from 'rxjs/operators';
import { empty, from, of, EMPTY } from 'rxjs';
import {
    searchPageActionTypes,
    fallbackSearch,
    showEmptyResultsViewOnSearchPage,
    showErrorViewOnSearchPage,
    showLoadingViewOnSearchPage,
    showSuccessResultsViewOnSearchPage,
    addSuccessResultsViewOnSearchPage,
    showTooManyResultsViewOnSearchPage,
} from '../SearchPage.actions';
import {
    getTrackedEntityInstances,
} from '../../../../trackedEntityInstances/trackedEntityInstanceRequests';
import {
    type DataElement,
    dataElementTypes,
    getTrackedEntityTypeThrowIfNotFound,
    getTrackerProgramThrowIfNotFound,
    scopeTypes,
} from '../../../../metaData';
import { PAGINATION } from '../SearchPage.constants';
import { buildUrlQueryString } from '../../../../utils/routing';
import {
    navigateToEnrollmentOverview,
} from '../../../../actions/navigateToEnrollmentOverview/navigateToEnrollmentOverview.actions';
import { dataElementConvertFunctions } from './SearchFormElementConverter/SearchFormElementConverter';


const getFiltersForUniqueIdSearchQuery = (formValues) => {
    const fieldId = Object.keys(formValues)[0];
    return [`${fieldId}:eq:${formValues[fieldId]}`];
};

const searchViaUniqueIdStream = (queryArgs, attributes, programId) =>
    from(getTrackedEntityInstances(queryArgs, attributes)).pipe(
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
            return of(showEmptyResultsViewOnSearchPage());
        }),
        startWith(showLoadingViewOnSearchPage()),
        catchError(() => of(showErrorViewOnSearchPage())),
    );

export const deriveFilterKeyword = (fieldId: string, attributes: Array<DataElement>): ("eq" | "like") => {
    const hasOptionSet = Boolean(attributes.find(({ id, optionSet }) => (id === fieldId) && (optionSet)));
    return hasOptionSet ? 'eq' : 'like';
};

const getFiltersForAttributesSearchQuery = (formValues, attributes) => Object.keys(formValues)
    .filter(fieldId => formValues[fieldId])
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
        return of(showTooManyResultsViewOnSearchPage());
    }
    return of(showErrorViewOnSearchPage());
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

            return showSuccessResultsViewOnSearchPage(
                searchResults,
                1,
            );
        }),
        startWith(showLoadingViewOnSearchPage()),
        catchError(handleErrors),
    );

export const searchViaUniqueIdOnScopeProgramEpic: Epic = (action$, store) =>
    action$.pipe(
        ofType(searchPageActionTypes.VIA_UNIQUE_ID_ON_SCOPE_PROGRAM_SEARCH),
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

            return searchViaUniqueIdStream(
                queryArgs,
                attributes,
                programId,
            );
        }),
    );


export const searchViaUniqueIdOnScopeTrackedEntityTypeEpic: Epic = (action$, store) =>
    action$.pipe(
        ofType(searchPageActionTypes.VIA_UNIQUE_ID_ON_SCOPE_TRACKED_ENTITY_TYPE_SEARCH),
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

            return searchViaUniqueIdStream(
                queryArgs,
                attributes,
            );
        }),
    );

export const searchViaAttributesOnScopeProgramEpic: Epic = (action$, store) =>
    action$.pipe(
        ofType(searchPageActionTypes.VIA_ATTRIBUTES_ON_SCOPE_PROGRAM_SEARCH),
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

            return searchViaAttributesStream(queryArgs, attributes, triggeredFrom);
        }),
    );

export const searchViaAttributesOnScopeTrackedEntityTypeEpic: Epic = (action$, store) =>
    action$.pipe(
        ofType(searchPageActionTypes.VIA_ATTRIBUTES_ON_SCOPE_TRACKED_ENTITY_TYPE_SEARCH),
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
        flatMap(({ payload: { programId, page, pageSize, availableSearchOptions } }) => {
            const trackerProgram = getTrackerProgramThrowIfNotFound(programId);
            if (trackerProgram.trackedEntityType) {
                const { id: trackedEntityTypeId } = trackerProgram.trackedEntityType;
                const { formsValues } = store.value;

                const { searchForm, formId } = deriveSearchFormInfo(availableSearchOptions[trackedEntityTypeId].searchGroups);
                const fallbackFormValues = deriveFormValues(searchForm, formsValues[formId]);

                return fallbackSearch({ trackedEntityTypeId, fallbackFormValues, page, pageSize });
            }

            return empty();
        }),
    );

export const fallbackSearchEpic: Epic = (action$: InputObservable) =>
    action$.pipe(
        ofType(searchPageActionTypes.FALLBACK_SEARCH),
        flatMap(({ payload: { fallbackFormValues, trackedEntityTypeId, pageSize, page } }) => {
            const attributes = getTrackedEntityTypeThrowIfNotFound(trackedEntityTypeId).attributes;

            const filter = getFiltersForAttributesSearchQuery(fallbackFormValues, attributes);
            const queryArgs = {
                filter,
                trackedEntityType: trackedEntityTypeId,
                page,
                pageSize,
                ouMode: 'ACCESSIBLE',
            };


            return from(getTrackedEntityInstances(queryArgs, attributes)).pipe(
                map(({ trackedEntityInstanceContainers: searchResults, pagingData }) => addSuccessResultsViewOnSearchPage(searchResults, pagingData.currentPage)),
                startWith(showLoadingViewOnSearchPage()),
                catchError(handleErrors),
            );
        }),
    );

export const fallbackPushPageEpic = (action$: InputObservable, _: ReduxStore, { history }: ApiUtils) =>
    action$.pipe(
        ofType(searchPageActionTypes.FALLBACK_SEARCH_COMPLETED),
        switchMap(({ payload: { orgUnitId, trackedEntityTypeId } }) => {
            history.push(`/search?${buildUrlQueryString({ orgUnitId, trackedEntityTypeId })}`);
            return EMPTY;
        }),
    );
