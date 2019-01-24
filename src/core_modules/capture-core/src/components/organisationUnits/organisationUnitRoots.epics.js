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
} from './organisationUnitRoots.actions';
import { set as setStoreRoots, get as getStoreRoots } from '../FormFields/New/Fields/OrgUnitField/orgUnitRoots.store';

const CAPTURE_RETRIEVE_ERROR = 'Could not retrieve capture org units';
// get organisation units for current user
export const loadCaptureOrgUnitRootsEpic = (action$: InputObservable) =>
    action$.ofType(startupActionTypes.STARTUP_DATA_LOAD_CORE)
        .switchMap(() => {
            const currentUser = getCurrentUser();
            return currentUser
                .getOrganisationUnits({
                    fields: [
                        'id,displayName,path,publicAccess,access,lastUpdated',
                        'children[id,displayName,publicAccess,access,path,children::isNotEmpty]',
                    ].join(','),
                    paging: false,
                })
                .then(d2RegUnitArray => ({ regUnitArray: d2RegUnitArray.toArray() }))
                .catch(error => ({ error }));
        })
        .map((resultContainer) => {
            if (resultContainer.error) {
                log.error(errorCreator(CAPTURE_RETRIEVE_ERROR)(
                    { error: resultContainer.error, method: 'loadCaptureOrgUnitRootsEpic' }),
                );
                return loadOrgUnitSearchRootsFailed(CAPTURE_RETRIEVE_ERROR);
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

            return getD2()
                .models
                .organisationUnits
                .list({
                    fields: [
                        'id,displayName,path,publicAccess,access,lastUpdated',
                        'children[id,displayName,publicAccess,access,path,children::isNotEmpty]',
                    ].join(','),
                    filter: `id:in:[${filterIds}]`,
                    paging: false,
                })
                .then(d2orgUnitArray => ({ regUnitArray: d2orgUnitArray.toArray() }))
                .catch(error => ({ error }));
        })
        .map((resultContainer) => {
            if (resultContainer.error) {
                log.error(errorCreator(CAPTURE_RETRIEVE_ERROR)(
                    { error: resultContainer.error, method: 'loadSearchOrgUnitRootsEpic' }),
                );
                return loadOrgUnitSearchRootsFailed(CAPTURE_RETRIEVE_ERROR);
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
