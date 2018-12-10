// @flow
import isArray from 'd2-utilizr/src/isArray';
import { fromPromise } from 'rxjs/observable/fromPromise';
import { convertValue as convertToClient } from '../../../converters/formToClient';
import { convertValue as convertToServer } from '../../../converters/clientToServer';
import { convertValue as convertToFilters } from '../serverToFilters';
import {
    actionTypes,
    searchTeiResultRetrieved,
    searchTeiFailed,
} from '../actions/teiSearch.actions';
import { getSearchGroupsByTrackedEntityType, getSearchGroupsByProgram } from '../getSearchGroups';
import { getTrackedEntityInstances } from '../../../trackedEntityInstances/trackedEntityInstanceRequests';


export const teiSearchEpic = (action$: InputObservable, store: ReduxStore) =>
    // $FlowSuppress
    action$.ofType(actionTypes.REQUEST_SEARCH_TEI)
        .switchMap((action) => {
            const state = store.getState();
            const { formId, itemId, searchId, programId, trackedEntityTypeId } = action.payload;
            const formValues = state.formsValues[formId];
            const searchGroups = programId ? getSearchGroupsByProgram(programId) : getSearchGroupsByTrackedEntityType(trackedEntityTypeId);

            const searchGroup = searchGroups[itemId];

            const filterValues = searchGroup.searchForm.convertValues(formValues,
                (type, value, element) =>
                    convertToFilters(type, convertToServer(type, convertToClient(type, value)), element));

            const filters = Object.keys(filterValues).reduce((accFilters, key) => {
                const value = filterValues[key];
                return isArray(value) ? [...accFilters, ...value] : [...accFilters, value];
            }, []);

            const queryArgs = {
                filter: filters,
                ou: state.currentSelections.orgUnitId,
                ouMode: 'ACCESSIBLE',
            };

            return fromPromise(getTrackedEntityInstances(queryArgs, searchGroup.searchForm).then(data =>
                searchTeiResultRetrieved(
                    data,
                    formId,
                    itemId,
                    searchId,
                ),
            )
                .catch(error => searchTeiFailed(formId, itemId, searchId)));
        });
