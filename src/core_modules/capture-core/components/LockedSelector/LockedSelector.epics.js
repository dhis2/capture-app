// @flow
import i18n from '@dhis2/d2-i18n';
import { push } from 'connected-react-router';
import { ofType } from 'redux-observable';
import { catchError, filter, map, switchMap } from 'rxjs/operators';
import { from, of } from 'rxjs';
import {
    lockedSelectorActionTypes,
    lockedSelectorBatchActionTypes,
    invalidSelectionsFromUrl,
    validSelectionsFromUrl,
    setCurrentOrgUnitBasedOnUrl,
    errorRetrievingOrgUnitBasedOnUrl,
    setEmptyOrgUnitBasedOnUrl,
} from './LockedSelector.actions';
import { programCollection } from '../../metaDataMemoryStores';
import { getApi } from '../../d2';
import { deriveUrlQueries, pageFetchesOrgUnitUsingTheOldWay, urlArguments } from '../../utils/url';

const exactUrl = (page: string, url: string) => {
    if (page && page !== 'viewEvent') {
        return `${page}?${url}`;
    }
    return `/?${url}`;
};

const fetchOrgUnits = id => getApi().get(`organisationUnits/${id}`, { fields: 'id,displayName' });

export const setOrgUnitIdEpic = (action$: InputObservable, store: ReduxStore) =>
    action$.pipe(
        ofType(lockedSelectorActionTypes.ORG_UNIT_ID_SET),
        map(({ payload: { orgUnitId } }) => {
            const { pathname } = store.value.router.location;
            const queries = deriveUrlQueries(store.value);

            return push(exactUrl(pathname, urlArguments({ ...queries, orgUnitId })));
        }));

export const resetOrgUnitId = (action$: InputObservable, store: ReduxStore) =>
    action$.pipe(
        ofType(lockedSelectorBatchActionTypes.ORG_UNIT_ID_RESET_BATCH),
        map(() => {
            const { app: { page } } = store.value;
            const { orgUnitId, ...restOfQueries } = deriveUrlQueries(store.value);

            return push(exactUrl(page, urlArguments({ ...restOfQueries })));
        }));

export const setProgramIdEpic = (action$: InputObservable, store: ReduxStore) =>
    action$.pipe(
        ofType(lockedSelectorActionTypes.PROGRAM_ID_SET),
        map(({ payload: { programId } }) => {
            const { pathname } = store.value.router.location;
            const queries = deriveUrlQueries(store.value);
            return push(exactUrl(pathname, urlArguments({ ...queries, programId })));
        }));

export const resetProgramIdEpic = (action$: InputObservable, store: ReduxStore) =>
    action$.pipe(
        ofType(lockedSelectorBatchActionTypes.PROGRAM_ID_RESET_BATCH),
        map(() => {
            const { app: { page } } = store.value;
            const { programId, ...restOfQueries } = deriveUrlQueries(store.value);

            // todo this is problematic here because when you are on the enrollment page you want to reset the page using the `pathname`
            // but also this action is triggered when you are clicking the `New` and `Search` button.
            // In these two cases we want to use the `page` from the redux
            return push(exactUrl(page, urlArguments({ ...restOfQueries })));
        }),
    );

export const startAgainEpic = (action$: InputObservable) =>
    action$.pipe(
        ofType(lockedSelectorBatchActionTypes.AGAIN_START),
        map(() => push('/')));

export const getOrgUnitDataBasedOnUrlUpdateEpic = (action$: InputObservable) =>
    action$.pipe(
        ofType(lockedSelectorActionTypes.CURRENT_SELECTIONS_UPDATE),
        filter(action => action.payload.nextProps.orgUnitId),
        switchMap(action =>
            fetchOrgUnits(action.payload.nextProps.orgUnitId)
                .then(response =>
                    setCurrentOrgUnitBasedOnUrl({ id: response.id, name: response.displayName }))
                .catch(() =>
                    errorRetrievingOrgUnitBasedOnUrl(i18n.t('Could not get organisation unit'))),
        ));

export const setOrgUnitDataEmptyBasedOnUrlUpdateEpic = (action$: InputObservable) =>
    action$.pipe(
        ofType(lockedSelectorActionTypes.CURRENT_SELECTIONS_UPDATE),
        filter(action => !action.payload.nextProps.orgUnitId),
        map(() => setEmptyOrgUnitBasedOnUrl()));

export const validateSelectionsBasedOnUrlUpdateEpic = (action$: InputObservable, store: ReduxStore) =>
    action$.pipe(
        ofType(
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

export const fetchOrgUnitEpic = (action$: InputObservable) =>
    action$.pipe(
        ofType(lockedSelectorActionTypes.FETCH_ORG_UNIT),
        switchMap(({ payload: { orgUnitId } }) =>
            from(fetchOrgUnits(orgUnitId))
                .pipe(
                    map(({ id, displayName: name }) =>
                        setCurrentOrgUnitBasedOnUrl({ id, name })),
                )),
        catchError(() => of(errorRetrievingOrgUnitBasedOnUrl(i18n.t('Could not get organisation unit')))),
    );
