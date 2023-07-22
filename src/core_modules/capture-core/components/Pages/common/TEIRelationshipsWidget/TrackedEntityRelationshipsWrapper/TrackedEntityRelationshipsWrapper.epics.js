// @flow
import { filter, map } from 'rxjs/operators';
import { ofType } from 'redux-observable';
import { batchActions } from 'redux-batched-actions';
import { actionTypes, batchActionTypes } from './TrackedEntityRelationshipsWrapper.actions';
import { getSearchGroups } from '../../../../TeiSearch/getSearchGroups';
import { getSearchFormId } from '../../../../TeiSearch/getSearchFormId';
import { addFormData } from '../../../../D2Form/actions/form.actions';
import { initializeTeiSearch } from '../../../../TeiSearch/actions/teiSearch.actions';

const searchId = 'relationshipTeiSearchWidget';

export const openRelationshipTeiSearchWidgetEpic =
    (action$: InputObservable) =>
        action$.pipe(
            ofType(actionTypes.WIDGET_SELECT_FIND_MODE),
            filter(action => action.payload.findMode && action.payload.findMode === 'TEI_SEARCH'),
            map((action) => {
                const { relationshipConstraint } = action.payload;
                const { trackedEntityTypeId, programId } = relationshipConstraint;

                const contextId = programId || trackedEntityTypeId;

                const searchGroups = getSearchGroups(trackedEntityTypeId, programId);


                const addFormDataActions = searchGroups ? searchGroups.map((sg, i) => {
                    const key = getSearchFormId(searchId, contextId, i.toString());
                    return addFormData(key, {});
                }) : [];

                return batchActions([
                    ...addFormDataActions,
                    initializeTeiSearch(searchId, programId, trackedEntityTypeId),
                ], batchActionTypes.BATCH_OPEN_TEI_SEARCH_WIDGET);
            }),
        );
