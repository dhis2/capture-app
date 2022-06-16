// @flow
/*
import { ofType } from 'redux-observable';
import { batchActions } from 'redux-batched-actions';
import { map } from 'rxjs/operators';
import { getSearchGroups } from '../../TeiSearch/getSearchGroups';
import { getSearchFormId } from '../../TeiSearch/getSearchFormId';
import { addFormData } from '../../D2Form/actions/form.actions';
import { initializeTeiSearch } from '../../TeiSearch/actions/teiSearch.actions';
import { batchActionTypes } from '../../Pages/NewRelationship/TeiRelationship/teiRelationship.actions';
import { NewTrackedEntityRelationshipActionTypes } from './NewTrackedEntityRelationship.actions';

const searchId = 'relationshipTeiSearch';

export const openRelationshipTeiSearchForWidgetEpic = (action$: InputObservable) =>
    action$.pipe(
        ofType(NewTrackedEntityRelationshipActionTypes.INIT_TEI_SEARCH_FOR_WIDGET),
        map((action) => {
            const { constraint } = action.payload.selectedRelationshipType;

            const { programId, trackedEntityType } = constraint;
            const contextId = programId || trackedEntityType?.id;

            const searchGroups = getSearchGroups(trackedEntityType?.id, programId);


            const addFormDataActions = searchGroups ? searchGroups.map((sg, i) => {
                const key = getSearchFormId(searchId, contextId, i.toString());
                return addFormData(key, {});
            }) : [];

            return batchActions([
                ...addFormDataActions,
                initializeTeiSearch(searchId, programId, trackedEntityType?.id),
            ], batchActionTypes.BATCH_OPEN_TEI_SEARCH);
        }));

*/
