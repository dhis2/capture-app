// @flow
import log from 'loglevel';
import { fromPromise } from 'rxjs/observable/fromPromise';
import getD2, { getCurrentUser } from 'capture-core/d2/d2Instance';
import errorCreator from '../../../utils/errorCreator';
import { actionTypes as startupActionTypes } from '../../../init/init.actions';
import {
    actionTypes as orgUnitListActions,
    initRegUnitListRoots,
    initRegUnitListRootsFailed,
    setSearchRoots,
    setSearchRootsFailed,
    showLoadingIndicator,
} from '../actions/orgUnitList.actions';
import { set as setStoreRoots } from '../../FormFields/New/Fields/OrgUnitField/orgUnitRoots.store';
import { LOADING_INDICATOR_TIMEOUT } from '../../../constants';

const RETRIEVE_ERROR = 'Could not retrieve registering unit list';

// get organisation units based on search criteria
export const searchRegisteringUnitListEpic = (action$: InputObservable) =>
    action$.ofType(orgUnitListActions.SEARCH_ORG_UNITS)
        .switchMap((action) => {
            const searchText = action.payload.searchText;
            return getD2()
                .models
                .organisationUnits
                .list({
                    fields: [
                        'id,displayName,path,publicAccess,access,lastUpdated',
                        'children[id,displayName,publicAccess,access,path,children::isNotEmpty]',
                    ].join(','),
                    paging: true,
                    withinUserHierarchy: true,
                    query: searchText,
                    pageSize: 15,
                })
                .then(orgUnitCollection => ({ regUnitArray: orgUnitCollection.toArray(), searchText }))
                .catch(error => ({ error }));
        })
        .map((resultContainer) => {
            if (resultContainer.error) {
                log.error(errorCreator(RETRIEVE_ERROR)(
                    { error: resultContainer.error, method: 'searchRegisteringUnitListEpic' }),
                );
                return setSearchRootsFailed(RETRIEVE_ERROR);
            }

            const regUnitArray = resultContainer.regUnitArray;
            setStoreRoots('regUnit', regUnitArray);
            const regUnits = resultContainer.regUnitArray
                .map(unit => ({
                    id: unit.id,
                    path: unit.path,
                    displayName: unit.displayName,
                }));
            return setSearchRoots(regUnits, resultContainer.searchText);
        });

// show loading indicator if api-request is not resolved when timeout expires
export const showRegisteringUnitListIndicatorEpic = (action$: InputObservable) =>
    action$.ofType(orgUnitListActions.SEARCH_ORG_UNITS)
        .switchMap(() =>
            fromPromise(new Promise((resolve) => {
                setTimeout(() => resolve(), LOADING_INDICATOR_TIMEOUT);
            }))
                .takeUntil(action$.ofType(
                    orgUnitListActions.SET_SEARCH_ROOTS,
                    orgUnitListActions.SET_SEARCH_ROOTS_FAILED)),
        )
        .map(() => showLoadingIndicator());
