// @flow
import i18n from '@dhis2/d2-i18n';
import { ofType } from 'redux-observable';
import { catchError, filter, flatMap, map, startWith, switchMap } from 'rxjs/operators';
import { from, of } from 'rxjs';
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
import { programCollection } from '../../metaDataMemoryStores';
import { deriveUrlQueries, getLocationPathname, pageFetchesOrgUnitUsingTheOldWay } from '../../utils/url';
import { getLocationQuery, buildUrlQueryString } from '../../utils/routing';
import { resetLocationChange } from './QuickSelector/actions/QuickSelector.actions';

const derivePayloadFromAction = (batchPayload, actionType) => {
    // $FlowFixMe
    const { payload } = Object.values(batchPayload).find(({ type }) => type === actionType);
    return payload;
};

const orgUnitsQuery = id => ({ resource: 'organisationUnits', id });

export const setOrgUnitIdEpic = (action$: InputObservable, store: ReduxStore, { history }: ApiUtils) =>
    action$.pipe(
        ofType(lockedSelectorActionTypes.ORG_UNIT_ID_SET),
        switchMap(({ payload: { orgUnitId, pageToPush } }) => {
            const { programId, ...restOfQueries } = deriveUrlQueries(store.value);

            if (programId) {
                const programContainsOrgUnitId = programCollection.get(programId)?.organisationUnits[orgUnitId];
                if (orgUnitId && !programContainsOrgUnitId) {
                    history.push(`/${pageToPush}?${buildUrlQueryString({ ...restOfQueries, orgUnitId })}`);
                    return new Promise((resolve) => {
                        setTimeout(() => resolve(resetLocationChange()), 0);
                    });
                }
            }
            history.push(`/${pageToPush}?${buildUrlQueryString({ ...restOfQueries, programId, orgUnitId })}`);
            return new Promise((resolve) => {
                setTimeout(() => resolve(resetLocationChange()), 0);
            });
        }));

export const resetOrgUnitId = (action$: InputObservable, store: ReduxStore, { history }: ApiUtils) =>
    action$.pipe(
        ofType(lockedSelectorBatchActionTypes.ORG_UNIT_ID_RESET_BATCH),
        switchMap(({ payload: batchPayload }) => {
            const { pageToPush } = derivePayloadFromAction(batchPayload, lockedSelectorActionTypes.ORG_UNIT_ID_RESET);
            const { orgUnitId, ...restOfQueries } = deriveUrlQueries(store.value);

            history.push(`/${pageToPush}?${buildUrlQueryString({ ...restOfQueries })}`);
            return new Promise((resolve) => {
                setTimeout(() => resolve(resetLocationChange()), 0);
            });
        }));

export const setProgramIdEpic = (action$: InputObservable, store: ReduxStore, { history }: ApiUtils) =>
    action$.pipe(
        ofType(lockedSelectorActionTypes.PROGRAM_ID_SET),
        switchMap(({ payload: { programId, pageToPush } }) => {
            const queries = deriveUrlQueries(store.value);

            history.push(`/${pageToPush}?${buildUrlQueryString({ ...queries, programId })}`);
            return new Promise((resolve) => {
                setTimeout(() => resolve(resetLocationChange()), 0);
            });
        }));

export const resetProgramIdEpic = (action$: InputObservable, store: ReduxStore, { history }: ApiUtils) =>
    action$.pipe(
        ofType(lockedSelectorBatchActionTypes.PROGRAM_ID_RESET_BATCH),
        switchMap(({ payload: batchPayload }) => {
            const { pageToPush } = derivePayloadFromAction(batchPayload, lockedSelectorActionTypes.PROGRAM_ID_RESET);
            const { programId, ...restOfQueries } = deriveUrlQueries(store.value);

            history.push(`/${pageToPush}?${buildUrlQueryString({ ...restOfQueries })}`);
            return new Promise((resolve) => {
                setTimeout(() => resolve(resetLocationChange()), 0);
            });
        }),
    );

export const startAgainEpic = (action$: InputObservable, store: InputObservable, { history }: ApiUtils) =>
    action$.pipe(
        ofType(lockedSelectorBatchActionTypes.AGAIN_START),
        switchMap(() => {
            history.push('/');
            return new Promise((resolve) => {
                setTimeout(() => resolve(resetLocationChange()), 0);
            });
        }));

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
                        of(setCurrentOrgUnitBasedOnUrl({ id: response.id, name: response.displayName, code: response.code }))),
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

export const validateSelectionsBasedOnUrlUpdateEpic = (action$: InputObservable) =>
    action$.pipe(
        ofType(
            lockedSelectorActionTypes.FROM_URL_UPDATE_COMPLETE,
            lockedSelectorActionTypes.FETCH_ORG_UNIT_SUCCESS,
            lockedSelectorActionTypes.EMPTY_ORG_UNIT_SET,
        ),
        filter(() => {
            const pathname = getLocationPathname();
            return pageFetchesOrgUnitUsingTheOldWay(pathname.substring(1));
        }),
        map(() => {
            const { programId, orgUnitId } = getLocationQuery();

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
                    map(({ id, displayName: name, code }) =>
                        setCurrentOrgUnitBasedOnUrl({ id, name, code })),
                )),
        catchError(() => of(errorRetrievingOrgUnitBasedOnUrl(i18n.t('Could not get organisation unit')))),
    );

export const resetTeiSelectionEpic = (action$: InputObservable, store: ReduxStore, { history }: ApiUtils) =>
    action$.pipe(
        ofType(lockedSelectorActionTypes.TEI_SELECTION_RESET),
        switchMap(() => {
            const { programId, orgUnitId } = getLocationQuery();

            history.push(`/?${buildUrlQueryString({ programId, orgUnitId })}`);
            return new Promise((resolve) => {
                setTimeout(() => resolve(resetLocationChange()), 0);
            });
        }),
    );

export const setEnrollmentSelectionEpic = (action$: InputObservable, store: ReduxStore, { history }: ApiUtils) =>
    action$.pipe(
        ofType(lockedSelectorActionTypes.ENROLLMENT_SELECTION_SET),
        map(({ payload: { enrollmentId } }) => {
            const { programId, orgUnitId, teiId } = getLocationQuery();

            history.push(`/enrollment?${buildUrlQueryString({ programId, orgUnitId, teiId, enrollmentId })}`);
            return resetLocationChange();
        }),
    );

export const resetEnrollmentSelectionEpic = (action$: InputObservable, _: ReduxStore, { history }: ApiUtils) =>
    action$.pipe(
        ofType(lockedSelectorActionTypes.ENROLLMENT_SELECTION_RESET),
        map(() => {
            const { orgUnitId, programId, teiId } = getLocationQuery();
            history.push(`/enrollment?${buildUrlQueryString({ programId, orgUnitId, teiId })}`);
            return resetLocationChange();
        }),
    );
