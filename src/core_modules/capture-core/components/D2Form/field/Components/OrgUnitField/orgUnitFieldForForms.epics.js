// @flow
import log from 'loglevel';
import getD2 from 'capture-core/d2/d2Instance';
import { from } from 'rxjs/observable/from';
import { map, concatMap } from 'rxjs/operators';
import { ofType } from 'redux-observable';
import isArray from 'd2-utilizr/lib/isArray';
import { errorCreator } from 'capture-core-utils';
import getOrgUnitRootsKey from './getOrgUnitRootsKey';

import { actionTypes as formActionTypes } from '../../../actions/form.actions';

import {
    actionTypes,
    filterFormFieldOrgUnitsFailed,
    filteredFormFieldOrgUnitsRetrieved,
} from './orgUnitFieldForForms.actions';

import { set as setStoreRoots } from '../../../../FormFields/New/Fields/OrgUnitField/orgUnitRoots.store';

const FILTER_RETRIEVE_ERROR = 'Filter form field org units failed';

const isAddFormData = (action: Object, formId: string) =>
    action.type === formActionTypes.ADD_FORM_DATA && action.payload.formId === formId;

const isRequestFilterFormFieldOrgUnits = (action: Object, formId: string, elementId: string) =>
    action.type === actionTypes.REQUEST_FILTER_FORM_FIELD_ORG_UNITS &&
    action.payload.formId === formId &&
    action.payload.elementId === elementId;


const cancelActionFilter = (action: Object, formId: string, elementId: string) => {
    if (isArray(action.payload)) {
        return action.payload.some(innerAction => isAddFormData(innerAction, formId));
    }
    return isAddFormData(action, formId) || isRequestFilterFormFieldOrgUnits(action, formId, elementId);
};

export const filterFormFieldOrgUnitsEpic = (action$: InputObservable, store: ReduxStore) =>
    action$.pipe(
        ofType(actionTypes.REQUEST_FILTER_FORM_FIELD_ORG_UNITS),
        concatMap((action) => {
            const { formId, elementId, searchText } = action.payload;
            return from(getD2()
                .models
                .organisationUnits
                .list({
                    fields: [
                        'id,displayName,path,publicAccess,access,lastUpdated',
                        'children[id,displayName,publicAccess,access,path,children::isNotEmpty]',
                    ].join(','),
                    paging: false,
                    query: searchText,
                    withinUserSearchHierarchy: true,
                })
                .then(orgUnitCollection => ({ orgUnitArray: orgUnitCollection.toArray(), searchText, formId, elementId }))
                .catch(error => ({ error, formId, elementId }))).takeUntil(action$.filter(a => cancelActionFilter(a, formId, elementId)));
        }),
        map((resultContainer) => {
            if (resultContainer.error) {
                log.error(errorCreator(FILTER_RETRIEVE_ERROR)(
                    { error: resultContainer.error, method: 'FilterOrgUnitRootsEpic' }),
                );
                return filterFormFieldOrgUnitsFailed(resultContainer.formId, resultContainer.elementId, FILTER_RETRIEVE_ERROR);
            }

            const { orgUnitArray, formId, elementId } = resultContainer;
            setStoreRoots(getOrgUnitRootsKey(formId, elementId), orgUnitArray);
            const orgUnits = orgUnitArray
                .map(unit => ({
                    id: unit.id,
                    path: unit.path,
                    displayName: unit.displayName,
                }));
            return filteredFormFieldOrgUnitsRetrieved(formId, elementId, orgUnits);
        }));
