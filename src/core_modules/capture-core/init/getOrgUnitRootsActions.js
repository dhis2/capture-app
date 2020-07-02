// @flow
import getD2, { getCurrentUser } from '../d2/d2Instance';
import {
    set as setStoreRoots,
    get as getStoreRoots,
} from '../components/FormFields/New/Fields/OrgUnitField/orgUnitRoots.store';
import { loadOrgUnitCaptureRootsSuccess, loadOrgUnitSearchRootsSuccess } from './init.actions';

const defaultFields = 'id,displayName,path,publicAccess,access,lastUpdated,children[id,displayName,publicAccess,access,path,children::isNotEmpty]';

function loadCaptureOrgUnitRootsAsync() {
    const currentUser = getCurrentUser();
    return currentUser
        // $FlowFixMe[prop-missing] automated comment
        .getOrganisationUnits({
            defaultFields,
            paging: false,
        })
        .then(d2RegUnitArray => d2RegUnitArray.toArray());
}

function loadSearchOrgUnitRootsAsync() {
    const currentUser = getCurrentUser();
    // $FlowFixMe[prop-missing] automated comment
    if (!currentUser.teiSearchOrganisationUnits || currentUser.teiSearchOrganisationUnits.length === 0) {
        // $FlowSuppress
        // $FlowFixMe[incompatible-call] automated comment
        return Promise.resolve(getStoreRoots('captureRoots'));
    }
    // $FlowFixMe[incompatible-use] automated comment
    const filterIds = currentUser.teiSearchOrganisationUnits.map(o => o.id).join(',');
    return getD2()
        .models
        .organisationUnits
        .list({
            fields: defaultFields,
            filter: `id:in:[${filterIds}]`,
            paging: false,
        })
        .then(d2orgUnitArray => d2orgUnitArray.toArray());
}

async function getOrgUnitCaptureRootsAction() {
    const captureRoots = await loadCaptureOrgUnitRootsAsync();
    setStoreRoots('captureRoots', captureRoots);
    const captureRootsForStore = captureRoots
        .map(unit => ({
            id: unit.id,
            path: unit.path,
            displayName: unit.displayName,
        }));
    return loadOrgUnitCaptureRootsSuccess(captureRootsForStore);
}

async function getOrgUnitSearchRootsAction() {
    const searchRoots = await loadSearchOrgUnitRootsAsync();
    setStoreRoots('searchRoots', searchRoots);
    const searchRootsForStore = searchRoots
        .map(unit => ({
            id: unit.id,
            path: unit.path,
            displayName: unit.displayName,
        }));
    return loadOrgUnitSearchRootsSuccess(searchRootsForStore);
}

export default async function getOrgUnitRootsActions() {
    const captureRootsAction = await getOrgUnitCaptureRootsAction();
    const searchRootsAction = await getOrgUnitSearchRootsAction();
    return [
        captureRootsAction,
        searchRootsAction,
    ];
}
