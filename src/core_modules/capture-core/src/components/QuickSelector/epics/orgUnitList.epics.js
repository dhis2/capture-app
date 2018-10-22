// @flow
/* eslint-disable import/prefer-default-export */
import getD2, { getCurrentUser } from 'capture-core/d2/d2Instance';
import { actionTypes as startupActionTypes } from '../../../init/init.actions';
import { actionTypes as orgUnitListActions, initRegUnitListRoots, setRoots } from '../actions/orgUnitList.actions';

export const loadRegisteringUnitListRootsEpic = action$ =>
    action$.ofType(startupActionTypes.STARTUP_DATA_LOAD_CORE)
        .switchMap(() => {
            const currentUser = getCurrentUser();
            // Get orgUnits assigned to currentUser and set them as roots to be used by orgUnitTree.
            return currentUser.getOrganisationUnits({
                fields: 'id,path,displayName',
                paging: false,
            });
        })
        .map((d2RegUnits) => {
            const regUnits = d2RegUnits
                .toArray()
                .map(unit => ({
                    id: unit.id,
                    path: unit.path,
                    displayName: unit.displayName,
                }));
            return initRegUnitListRoots(regUnits);
        });

export const filterRegisteringUnitListEpic = action$ =>
    action$.ofType(orgUnitListActions.SEARCH_ORG_UNITS)
        .switchMap((action) => {
            const filter = action.payload.filter;
            getD2()
                .models
                .organisationUnits
                .list({
                    fields: 'id,path,displayName',
                    paging: false,
                    withinUserHierarchy: true,
                    query: filter,
                    pageSize: 15,
                })
                .then(orgUnitCollection => orgUnitCollection.toArray());
        })
        .map((regUnits) => {
            regUnits
                .map(unit => ({
                    id: unit.id,
                    path: unit.path,
                    displayName: unit.displayName,
                }));
            return setRoots(regUnits, filter);
        })