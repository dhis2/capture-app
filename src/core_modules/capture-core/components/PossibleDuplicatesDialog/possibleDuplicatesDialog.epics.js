// @flow
import { pipe as pipeD2 } from 'capture-core-utils';
import { ofType } from 'redux-observable';
import { catchError, map, switchMap } from 'rxjs/operators';
import { of, from } from 'rxjs';
import {
    actionTypes,
    duplicatesForReviewRetrievalSuccess,
    duplicatesForReviewRetrievalFailed,
} from './possibleDuplicatesDialog.actions';
import {
    scopeTypes, getScopeFromScopeId, EventProgram, TrackerProgram, TrackedEntityType,
} from '../../metaData';
import { getDataEntryKey } from '../DataEntry/common/getDataEntryKey';
import { convertFormToClient, convertClientToServer } from '../../converters';
import { getTrackedEntityInstances } from '../../trackedEntityInstances/trackedEntityInstanceRequests';
import { getAttributesFromScopeId } from '../../metaData/helpers';

function getGroupElementsFromScopeId(scopeId: ?string) {
    if (!scopeId) {
        return null;
    }
    const scope = getScopeFromScopeId(scopeId);
    if (scope instanceof EventProgram) {
        return null;
    } else if (scope instanceof TrackerProgram) {
        return scope.enrollment.inputSearchGroups
          && scope.enrollment.inputSearchGroups[0].searchFoundation.getElements();
    } else if (scope instanceof TrackedEntityType) {
        return scope.teiRegistration.inputSearchGroups
          && scope.teiRegistration.inputSearchGroups[0].searchFoundation.getElements();
    }
    return null;
}


export const loadSearchGroupDuplicatesForReviewEpic: Epic = (action$, store) =>
    action$.pipe(
        ofType(actionTypes.DUPLICATES_REVIEW, actionTypes.DUPLICATES_REVIEW_CHANGE_PAGE),
        switchMap(({
            payload: {
                page,
                pageSize,
                orgUnitId,
                selectedScopeId,
                scopeType,
                dataEntryId,
            },
        }) => {
            const { formsValues, dataEntries } = store.value;
            const dataEntryKey = getDataEntryKey(dataEntryId, dataEntries[dataEntryId].itemId);
            const formValues = formsValues[dataEntryKey];

            try {
                const groupElements = getGroupElementsFromScopeId(selectedScopeId) || [];
                const filters = groupElements
                    .map((element) => {
                        const value = formValues[element.id];
                        if (!value && value !== 0 && value !== false) {
                            return null;
                        }
                        const serverValue = element.convertValue(value, pipeD2(convertFormToClient, convertClientToServer));
                        return `${element.id}:${element.optionSet ? 'eq' : 'like'}:${serverValue}`;
                    })
                    .filter(f => f);

                const contextParam = scopeType === scopeTypes.TRACKER_PROGRAM ? { program: selectedScopeId } : { trackedEntityType: selectedScopeId };
                const queryArgs = {
                    ou: orgUnitId,
                    ouMode: 'ACCESSIBLE',
                    pageSize,
                    page,
                    filter: filters,
                    fields: '*',
                    ...contextParam,
                };
                const attributes = getAttributesFromScopeId(selectedScopeId);

                const stream$: Stream = from(getTrackedEntityInstances(queryArgs, attributes));
                return stream$.pipe(
                    map(({ trackedEntityInstanceContainers: searchResults, pagingData }) =>
                        duplicatesForReviewRetrievalSuccess(searchResults, pagingData.currentPage)),
                    catchError(() => of(duplicatesForReviewRetrievalFailed())),

                );
            } catch (error) {
                return Promise.resolve(duplicatesForReviewRetrievalFailed());
            }
        }),
    );
