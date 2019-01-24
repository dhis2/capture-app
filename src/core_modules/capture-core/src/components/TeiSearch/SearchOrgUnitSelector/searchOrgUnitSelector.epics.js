// @flow
import log from 'loglevel';
import { fromPromise } from 'rxjs/observable/fromPromise';
import getD2 from 'capture-core/d2/d2Instance';
import errorCreator from '../../../utils/errorCreator';

import {
    actionTypes as searchOrgUnitActionTypes,
    setSearchOrgUnitResults,
    setSearchOrgUnitResultsFailed,
} from './searchOrgUnitSelector.actions';

import { set as setStoreRoots } from '../../FormFields/New/Fields/OrgUnitField/orgUnitRoots.store';

const RETRIEVE_ERROR = 'Could not retrieve registering unit list';

// get organisation units based on search criteria
export const searchRegisteringUnitListEpic = (action$: InputObservable) =>
    // $FlowFixMe
    action$.ofType(searchOrgUnitActionTypes.TEI_SEARCH_SEARCH_ORG_UNITS)
        .switchMap((action) => {
            const searchText = action.payload.searchText;
            const searchId = action.payload.searchId;
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
                .then(orgUnitCollection => ({ regUnitArray: orgUnitCollection.toArray(), searchText, searchId }))
                .catch(error => ({ error, searchId }));
        })
        .map((resultContainer) => {
            if (resultContainer.error) {
                log.error(errorCreator(RETRIEVE_ERROR)(
                    { error: resultContainer.error, method: 'searchRegisteringUnitListEpic' }),
                );
                return setSearchOrgUnitResultsFailed(resultContainer.searchId, RETRIEVE_ERROR);
            }

            const regUnitArray = resultContainer.regUnitArray;
            setStoreRoots(resultContainer.searchId, regUnitArray);
            const regUnits = resultContainer.regUnitArray
                .map(unit => ({
                    id: unit.id,
                    path: unit.path,
                    displayName: unit.displayName,
                }));
            return setSearchOrgUnitResults(resultContainer.searchId, regUnits, resultContainer.searchText);
        });
