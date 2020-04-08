// @flow
import { requestConfigSave } from './saveConfigDialog.actions';
import { ofType } from 'redux-observable';
import { concatMap } from 'rxjs/operators';

export const saveConfigEpic = (action$: InputObservable, store: ReduxStore) =>
    action$.pipe(
        ofType(requestConfigSave),
        concatMap(() => {
            const state = store.getState();
            const programId = state.currentSelections.programId;
            const {
                currentListId: listId,
                workingListConfigs,
                currentConfigId,
            } = state.workingListsTemplates.eventList;
            const listName = workingListConfigs[currentConfigId].displayName;
            const { filters, sortById, sortByDirection } = state.workingListsMeta[listId];
            const columnsOrder = state.workingListsColumnsOrder[listId];
        }));

