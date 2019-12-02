// @flow
import { requestConfigSave } from './saveConfigDialog.actions';
import { convertToApiFilters } from './filterConverter';

function getColumns() {

}

function getOrder() {

}

export const saveConfigEpic = (action$: InputObservable, store: ReduxStore) =>
    action$
        .ofType(requestConfigSave)
        .concatMap(() => {
            const state = store.getState();
            const programId = state.currentSelections.programId;
            const {
                currentListId: listId,
                workingListConfigs,
                currentConfigId,
            } = state.workingListConfigSelector.eventMainPage;
            const listName = workingListConfigs[currentConfigId].displayName;
            const { filters, sortById, sortByDirection } = state.workingListsMeta[listId];
            const columnsOrder = state.workingListsColumnsOrder[listId];
            
        })

