// @flow
import log from 'loglevel';
import getD2, { getCurrentUser } from 'capture-core/d2/d2Instance';
import errorCreator from '../../utils/errorCreator';
import { actionTypes as startupActionTypes } from '../../init/init.actions';
import {
    actionTypes as orgUnitRootsActionTypes,
    setOrgUnitCaptureRoots,
    setOrgUnitSearchRoots,
    loadOrgUnitSearchRootsFailed,
    loadOrgUnitCaptureRootsFailed,
    filterOrgUnitRootsFailed,
    filteredOrgUnitRootsRetrieved,
} from './organisationUnitRoots.actions';
import { set as setStoreRoots, get as getStoreRoots } from '../FormFields/New/Fields/OrgUnitField/orgUnitRoots.store';

const defaultFields = 'id,displayName,path,publicAccess,access,lastUpdated,children[id,displayName,publicAccess,access,path,children::isNotEmpty]';

const errorMessages = {
    CAPTURE_RETRIEVE_ERROR: 'Could not retrieve capture org units',
    SEARCH_RETRIEVE_ERROR: 'Could not retrieve search org units',
    FILTER_RETRIEVE_ERROR: 'Could not filter org units',
};
// get organisation units for current user
export const loadCaptureOrgUnitRootsEpic = (action$: InputObservable) =>
    action$.ofType(startupActionTypes.STARTUP_DATA_LOAD_CORE)
        .switchMap(() => {
            const currentUser = getCurrentUser();
            const fields = defaultFields;
            return currentUser
                .getOrganisationUnits({
                    fields,
                    paging: false,
                })
                .then(d2RegUnitArray => ({ regUnitArray: d2RegUnitArray.toArray() }))
                .catch(error => ({ error }));
        })
        .map((resultContainer) => {
            if (resultContainer.error) {
                log.error(errorCreator(errorMessages.CAPTURE_RETRIEVE_ERROR)(
                    { error: resultContainer.error, method: 'loadCaptureOrgUnitRootsEpic' }),
                );
                return loadOrgUnitCaptureRootsFailed(errorMessages.CAPTURE_RETRIEVE_ERROR);
            }

            const regUnitArray = resultContainer.regUnitArray;
            setStoreRoots('captureRoots', regUnitArray);
            const regUnits = regUnitArray
                .map(unit => ({
                    id: unit.id,
                    path: unit.path,
                    displayName: unit.displayName,
                }));
            return setOrgUnitCaptureRoots(regUnits);
        });

export const loadSearchOrgUnitRootsEpic = (action$: InputObservable) =>
    action$.ofType(orgUnitRootsActionTypes.SET_ORG_UNIT_CAPTURE_ROOTS)
        .switchMap(() => {
            const currentUser = getCurrentUser();
            if (!currentUser.teiSearchOrganisationUnits || currentUser.teiSearchOrganisationUnits.length === 0) {
                return Promise.resolve({ regUnitArray: getStoreRoots('captureRoots') });
            }
            const filterIds = currentUser.teiSearchOrganisationUnits.map(o => o.id).join(',');
            const fields = defaultFields;
            return getD2()
                .models
                .organisationUnits
                .list({
                    fields: defaultFields,
                    filter: `id:in:[${filterIds}]`,
                    paging: false,
                })
                .then(d2orgUnitArray => ({ regUnitArray: d2orgUnitArray.toArray() }))
                .catch(error => ({ error }));
        })
        .map((resultContainer) => {
            if (resultContainer.error) {
                log.error(errorCreator(errorMessages.SEARCH_RETRIEVE_ERROR)(
                    { error: resultContainer.error, method: 'loadSearchOrgUnitRootsEpic' }),
                );
                return loadOrgUnitSearchRootsFailed(errorMessages.SEARCH_RETRIEVE_ERROR);
            }

            const regUnitArray = resultContainer.regUnitArray;
            setStoreRoots('searchRoots', regUnitArray);
            const regUnits = regUnitArray
                .map(unit => ({
                    id: unit.id,
                    path: unit.path,
                    displayName: unit.displayName,
                }));
            return setOrgUnitSearchRoots(regUnits);
        });

export const filterOrgUnitRootsEpic = (action$: InputObservable) =>
    action$.ofType(orgUnitRootsActionTypes.REQUEST_FILTER_ORG_UNIT_ROOTS)
        .switchMap((action) => {
            const payload = action.payload;
            const searchText = payload.searchText;
            const key = payload.key;
            const fields = defaultFields;
            const parameters = payload.parameters;
            return getD2()
                .models
                .organisationUnits
                .list({
                    fields,
                    paging: false,
                    query: searchText,
                    ...parameters,
                })
                .then(orgUnitCollection => ({ orgUnitArray: orgUnitCollection.toArray(), searchText, key }))
                .catch(error => ({ error, key }));
        })
        .map((resultContainer) => {
            if (resultContainer.error) {
                log.error(errorCreator(errorMessages.FILTER_RETRIEVE_ERROR)(
                    { error: resultContainer.error, method: 'FilterOrgUnitRootsEpic' }),
                );
                return filterOrgUnitRootsFailed(errorMessages.FILTER_RETRIEVE_ERROR);
            }

            const { orgUnitArray, key } = resultContainer;
            setStoreRoots(key, orgUnitArray);
            const orgUnits = orgUnitArray
                .map(unit => ({
                    id: unit.id,
                    path: unit.path,
                    displayName: unit.displayName,
                }));
            return filteredOrgUnitRootsRetrieved(key, orgUnits);
        });

