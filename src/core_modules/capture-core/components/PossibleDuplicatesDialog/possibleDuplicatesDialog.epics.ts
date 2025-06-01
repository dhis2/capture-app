import { pipe as pipeD2, featureAvailable, FEATURES } from 'capture-core-utils';
import { ofType } from 'redux-observable';
import { catchError, map, switchMap, takeUntil } from 'rxjs/operators';
import { of, from } from 'rxjs';
import {
    actionTypes,
    duplicatesForReviewRetrievalSuccess,
    duplicatesForReviewRetrievalFailed,
    duplicatesReviewSkipped,
} from './possibleDuplicatesDialog.actions';
import {
    scopeTypes, getScopeFromScopeId, EventProgram, TrackerProgram, TrackedEntityType, dataElementTypes,
} from '../../metaData';
import { getDataEntryKey } from '../DataEntry/common/getDataEntryKey';
import { convertFormToClient, convertClientToServer } from '../../converters';
import { getTrackedEntityInstances } from '../../trackedEntityInstances/trackedEntityInstanceRequests';
import { getAttributesFromScopeId } from '../../metaData/helpers';
import { escapeString } from '../../utils/escapeString';

function getGroupElementsFromScopeId(scopeId: string | null) {
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


export const loadSearchGroupDuplicatesForReviewEpic = (
    action$: any,
    store: any,
    { absoluteApiPath, querySingleResource }: { absoluteApiPath: string, querySingleResource: any },
) =>
    action$.pipe(
        ofType(actionTypes.DUPLICATES_REVIEW, actionTypes.DUPLICATES_REVIEW_CHANGE_PAGE),
        switchMap(({
            payload: {
                page,
                pageSize,
                selectedScopeId,
                scopeType,
                dataEntryId,
            },
        }: any) => {
            const { formsValues, dataEntries } = store.value;
            const dataEntryKey = getDataEntryKey(dataEntryId, dataEntries[dataEntryId].itemId);
            const formValues = formsValues[dataEntryKey];

            try {
                const groupElements = getGroupElementsFromScopeId(selectedScopeId) || [];
                const filters = groupElements
                    .map((element: any) => {
                        const value = formValues[element.id];
                        if (!value && value !== 0 && value !== false) {
                            return null;
                        }
                        const serverValue = element.convertValue(value, pipeD2(convertFormToClient, convertClientToServer));
                        const hasOptionSet = element.optionSet && element.type !== dataElementTypes.MULTI_TEXT;
                        return `${element.id}:${hasOptionSet ? 'eq' : 'like'}:${escapeString(serverValue)}`;
                    })
                    .filter((f: string | null) => f);

                if (filters.length === 0) {
                    return Promise.resolve(duplicatesReviewSkipped());
                }

                const contextParam = scopeType === scopeTypes.TRACKER_PROGRAM ? { program: selectedScopeId } : { trackedEntityType: selectedScopeId };
                const orgUnitModeQueryParam: string = featureAvailable(FEATURES.newOrgUnitModeQueryParam)
                    ? 'orgUnitMode'
                    : 'ouMode';
                const queryArgs = {
                    [orgUnitModeQueryParam]: 'ACCESSIBLE',
                    pageSize,
                    page,
                    filter: filters,
                    ...contextParam,
                };
                const attributes = getAttributesFromScopeId(selectedScopeId);
                const programId = scopeType === scopeTypes.TRACKER_PROGRAM ? selectedScopeId : null;

                const stream$ = from(
                    getTrackedEntityInstances(queryArgs, attributes, absoluteApiPath, querySingleResource, programId),
                );
                return stream$.pipe(
                    map(({ trackedEntityInstanceContainers: searchResults, pagingData }: { trackedEntityInstanceContainers: any, pagingData: any }) =>
                        duplicatesForReviewRetrievalSuccess(searchResults, pagingData.currentPage)),
                    takeUntil(action$.pipe(ofType(actionTypes.DUPLICATES_RESET))),
                    catchError(() => of(duplicatesForReviewRetrievalFailed())),

                );
            } catch (error) {
                return Promise.resolve(duplicatesForReviewRetrievalFailed());
            }
        }),
    );
