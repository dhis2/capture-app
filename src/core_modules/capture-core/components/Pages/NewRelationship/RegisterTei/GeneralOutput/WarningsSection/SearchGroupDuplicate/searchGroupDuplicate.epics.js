// @flow
import { pipe as pipeD2 } from 'capture-core-utils';
import { ofType } from 'redux-observable';
import { catchError, map, switchMap } from 'rxjs/operators';
import { of, from, Observable } from 'rxjs';
import {
    actionTypes,
    duplicatesForReviewRetrievalSuccess,
    duplicatesForReviewRetrievalFailed,
} from './searchGroupDuplicate.actions';
import {
    getTrackerProgramThrowIfNotFound,
    getTrackedEntityTypeThrowIfNotFound,
} from '../../../../../../../metaData';
import getDataEntryKey from '../../../../../../DataEntry/common/getDataEntryKey';
import { convertFormToClient, convertClientToServer } from '../../../../../../../converters';
import { getTrackedEntityInstances } from '../../../../../../../trackedEntityInstances/trackedEntityInstanceRequests';

const getProgramSearchGroup = (programId: string) => {
    const program = getTrackerProgramThrowIfNotFound(programId);
    // $FlowFixMe[incompatible-use] automated comment
    return program.enrollment.inputSearchGroups[0];
};

const getTETSearchGroup = (tetId: string) => {
    const tet = getTrackedEntityTypeThrowIfNotFound(tetId);
    // $FlowFixMe[incompatible-use] automated comment
    return tet.teiRegistration.inputSearchGroups[0];
};

const getSearchGroup = (programId: ?string, tetId: string) =>
    (programId ? getProgramSearchGroup(programId) : getTETSearchGroup(tetId));

export const loadSearchGroupDuplicatesForReviewEpic: Epic = (action$, store) =>
    action$.pipe(
        ofType(actionTypes.DUPLICATES_REVIEW, actionTypes.DUPLICATES_REVIEW_CHANGE_PAGE),
        switchMap((action) => {
            const isChangePage = action.type === actionTypes.DUPLICATES_REVIEW_CHANGE_PAGE;
            const requestPage = isChangePage ? action.payload.page : 1;

            const dataEntryId = 'relationship';
            const state = store.value;
            const { programId, orgUnit } = state.newRelationshipRegisterTei;
            const tetId = state.newRelationship.selectedRelationshipType.to.trackedEntityTypeId;
            const dataEntryKey = getDataEntryKey(dataEntryId, state.dataEntries[dataEntryId].itemId);
            const formValues = state.formsValues[dataEntryKey];

            let searchGroup;
            try {
                searchGroup = getSearchGroup(programId, tetId);
            } catch (error) {
                return Promise.resolve(duplicatesForReviewRetrievalFailed());
            }

            const groupElements = searchGroup.searchFoundation.getElements();
            const filters = groupElements
                .map((element) => {
                    const value = formValues[element.id];
                    if (!value && value !== 0 && value !== false) {
                        return null;
                    }

                    const serverValue = element.convertValue(value, pipeD2(convertFormToClient, convertClientToServer));
                    return `${element.id}:LIKE:${serverValue}`;
                })
                .filter(f => f);

            const contextParam = programId ? { program: programId } : { trackedEntityType: tetId };
            const queryArgs = {
                ou: orgUnit.id,
                ouMode: 'ACCESSIBLE',
                pageSize: 5,
                page: requestPage,
                totalPages: !isChangePage,
                filter: filters,
                ...contextParam,
            };
            const attributes = contextParam.program ?
                getTrackerProgramThrowIfNotFound(contextParam.program).attributes :
                getTrackedEntityTypeThrowIfNotFound((contextParam.trackedEntityType)).attributes;

            const stream$: Stream = from(getTrackedEntityInstances(queryArgs, attributes));
            return stream$.pipe(
                map(({ trackedEntityInstanceContainers: searchResults, pagingData }) => duplicatesForReviewRetrievalSuccess(searchResults, pagingData)),
                catchError(() => of(duplicatesForReviewRetrievalFailed())),

            );
        }),
    );
