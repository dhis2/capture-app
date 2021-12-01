// @flow
import i18n from '@dhis2/d2-i18n';
import { push } from 'connected-react-router';
import { ofType } from 'redux-observable';
import { from, of } from 'rxjs';
import { catchError, filter, flatMap, map, startWith, switchMap } from 'rxjs/operators';
import { programCollection } from '../../metaDataMemoryStores';
import { buildUrlQueryString } from '../../utils/routing';
import { deriveUrlQueries, pageFetchesOrgUnitUsingTheOldWay } from '../../utils/url';
import {
    lockedSelectorActionTypes,
    lockedSelectorBatchActionTypes,
    invalidSelectionsFromUrl,
    validSelectionsFromUrl,
    setCurrentOrgUnitBasedOnUrl,
    errorRetrievingOrgUnitBasedOnUrl,
    setEmptyOrgUnitBasedOnUrl,
    startLoading,
    completeUrlUpdate,
} from './LockedSelector.actions';

const derivePayloadFromAction = (batchPayload, actionType) => {
    // $FlowFixMe
    const { payload } = Object.values(batchPayload).find(({ type }) => type === actionType);
    return payload;
};

const orgUnitsQuery = id => ({ resource: 'organisationUnits', id });

export const setOrgUnitIdEpic = (action$: InputObservable, store: ReduxStore) =>
    action$.pipe(
        ofType(lockedSelectorActionTypes.ORG_UNIT_ID_SET),
        map(({ payload: { orgUnitId, pageToPush } }) => {
            const { programId, ...restOfQueries } = deriveUrlQueries(store.value);

            if (programId) {
                const programContainsOrgUnitId = programCollection.get(programId)?.organisationUnits[orgUnitId];
                if (orgUnitId && !programContainsOrgUnitId) {
                    return push(`/${pageToPush}?${buildUrlQueryString({ ...restOfQueries, orgUnitId })}`);
                }
            }

            return push(`/${pageToPush}?${buildUrlQueryString({ ...restOfQueries, programId, orgUnitId })}`);
        }));

export const resetOrgUnitId = (action$: InputObservable, store: ReduxStore) =>
    action$.pipe(
        ofType(lockedSelectorBatchActionTypes.ORG_UNIT_ID_RESET_BATCH),
        map(({ payload: batchPayload }) => {
            const { pageToPush } = derivePayloadFromAction(batchPayload, lockedSelectorActionTypes.ORG_UNIT_ID_RESET);
            const { orgUnitId, ...restOfQueries } = deriveUrlQueries(store.value);

            return push(`/${pageToPush}?${buildUrlQueryString({ ...restOfQueries })}`);
        }));

export const setProgramIdEpic = (action$: InputObservable, store: ReduxStore) =>
    action$.pipe(
        ofType(lockedSelectorActionTypes.PROGRAM_ID_SET),
        map(({ payload: { programId, pageToPush } }) => {
            const queries = deriveUrlQueries(store.value);

            return push(`/${pageToPush}?${buildUrlQueryString({ ...queries, programId })}`);
        }));

export const resetProgramIdEpic = (action$: InputObservable, store: ReduxStore) =>
    action$.pipe(
        ofType(lockedSelectorBatchActionTypes.PROGRAM_ID_RESET_BATCH),
        map(({ payload: batchPayload }) => {
            const { pageToPush } = derivePayloadFromAction(batchPayload, lockedSelectorActionTypes.PROGRAM_ID_RESET);
            const { programId, ...restOfQueries } = deriveUrlQueries(store.value);

            return push(`/${pageToPush}?${buildUrlQueryString({ ...restOfQueries })}`);
        }),
    );

export const startAgainEpic = (action$: InputObservable) =>
    action$.pipe(
        ofType(lockedSelectorBatchActionTypes.AGAIN_START),
        map(() => push('/')));

export const getOrgUnitDataBasedOnUrlUpdateEpic = (
    action$: InputObservable,
    store: ReduxStore,
    { querySingleResource }: ApiUtils) =>
    action$.pipe(
        ofType(lockedSelectorActionTypes.FROM_URL_UPDATE),
        filter(action => action.payload.nextProps.orgUnitId),
        switchMap((action) => {
            const { organisationUnits } = store.value;
            const { orgUnitId } = action.payload.nextProps;
            if (organisationUnits[orgUnitId]) {
                return of(completeUrlUpdate());
            }
            return from(querySingleResource(orgUnitsQuery(action.payload.nextProps.orgUnitId)))
                .pipe(
                    flatMap(response =>
                        of(setCurrentOrgUnitBasedOnUrl({ id: response.id, name: response.displayName }))),
                    catchError(() =>
                        of(errorRetrievingOrgUnitBasedOnUrl(i18n.t('Could not get organisation unit')))),
                    startWith(startLoading()),
                );
        },
        ));

export const setOrgUnitDataEmptyBasedOnUrlUpdateEpic = (action$: InputObservable) =>
    action$.pipe(
        ofType(lockedSelectorActionTypes.FROM_URL_UPDATE),
        filter(action => !action.payload.nextProps.orgUnitId),
        map(() => setEmptyOrgUnitBasedOnUrl()));

export const validateSelectionsBasedOnUrlUpdateEpic = (action$: InputObservable, store: ReduxStore) =>
    action$.pipe(
        ofType(
            lockedSelectorActionTypes.FROM_URL_UPDATE_COMPLETE,
            lockedSelectorActionTypes.FETCH_ORG_UNIT_SUCCESS,
            lockedSelectorActionTypes.EMPTY_ORG_UNIT_SET,
        ),
        filter(() => {
            const { location: { pathname } } = store.value.router;
            return pageFetchesOrgUnitUsingTheOldWay(pathname.substring(1));
        }),
        map(() => {
            const { programId, orgUnitId } = store.value.currentSelections;

            if (programId) {
                const program = programCollection.get(programId);
                if (!program) {
                    return invalidSelectionsFromUrl(i18n.t("Program doesn't exist"));
                }

                if (orgUnitId && !program.organisationUnits[orgUnitId]) {
                    return invalidSelectionsFromUrl(i18n.t('Selected program is invalid for selected registering unit'));
                }
            }

            return validSelectionsFromUrl();
        }));

export const fetchOrgUnitEpic = (
    action$: InputObservable,
    _: ReduxStore,
    { querySingleResource }: ApiUtils,
) =>
    action$.pipe(
        ofType(lockedSelectorActionTypes.FETCH_ORG_UNIT),
        switchMap(({ payload: { orgUnitId } }) =>
            from(querySingleResource(orgUnitsQuery(orgUnitId)))
                .pipe(
                    map(({ id, displayName: name }) =>
                        setCurrentOrgUnitBasedOnUrl({ id, name })),
                )),
        catchError(() => of(errorRetrievingOrgUnitBasedOnUrl(i18n.t('Could not get organisation unit')))),
    );

export const resetTeiSelectionEpic = (action$: InputObservable, store: ReduxStore) =>
    action$.pipe(
        ofType(lockedSelectorActionTypes.TEI_SELECTION_RESET),
        map(() => {
            const { query: { programId, orgUnitId } } = store.value.router.location;

            return push(`/?${buildUrlQueryString({ programId, orgUnitId })}`);
        }),
    );

export const setEnrollmentSelectionEpic = (action$: InputObservable, store: ReduxStore) =>
    action$.pipe(
        ofType(lockedSelectorActionTypes.ENROLLMENT_SELECTION_SET),
        map(({ payload: { enrollmentId } }) => {
            const { query: { programId, orgUnitId, teiId } } = store.value.router.location;

            return push(`/enrollment?${buildUrlQueryString({ programId, orgUnitId, teiId, enrollmentId })}`);
        }),
    );

export const resetEnrollmentSelectionEpic = (action$: InputObservable, store: ReduxStore) =>
    action$.pipe(
        ofType(lockedSelectorActionTypes.ENROLLMENT_SELECTION_RESET),
        map(() => {
            const { query: { orgUnitId, programId, teiId } } = store.value.router.location;
            return push(`/enrollment?${buildUrlQueryString({ programId, orgUnitId, teiId })}`);
        }),
    );
