// @flow
import { from } from 'rxjs';
import { concatMap, takeUntil, filter, map } from 'rxjs/operators';
import { ofType } from 'redux-observable';
import { RenderFoundation } from '../../../metaData';
import { convertFormToClient, convertClientToServer } from '../../../converters';
import getDataEntryKey from '../../DataEntry/common/getDataEntryKey';
import { checkForDuplicateActionTypes, checkForDuplicateSuccess } from './checkForDuplicate.actions';

const getSearchValues = (
    formValues: Object,
    searchFoundation: RenderFoundation,
) => {
    const formValuesForSearch = searchFoundation
        .getElements()
        .reduce((acc, element) => {
            acc[element.id] = formValues[element.id];
            return acc;
        }, {});

    return searchFoundation.convertValues(
        formValuesForSearch,
        (value, type) => convertClientToServer(convertFormToClient(value, type), type),
    );
};

export const checkForDuplicateEpic = (action$: InputObservable, store: ReduxStore) =>
    action$.pipe(
        ofType(checkForDuplicateActionTypes.DUPLICATE_CHECK),
        concatMap(({ payload: { searchGroup, dataEntryId, searchContext } }) => {
            const { itemId } = store.value.dataEntries[dataEntryId];
            const dataEntryKey = getDataEntryKey(dataEntryId, itemId);
            const formValues = store.value.formsValues[dataEntryKey];
            const searchValues = getSearchValues(formValues, searchGroup.searchFoundation);
            return from(searchGroup.onSearch(searchValues, searchContext))
                .pipe(
                    map(duplicateCount =>
                        checkForDuplicateSuccess(dataEntryId, Boolean(duplicateCount)),
                    ),
                    takeUntil(action$.pipe(
                        ofType(checkForDuplicateActionTypes.DUPLICATE_CHECK_RESET, checkForDuplicateActionTypes.DUPLICATE_CHECK_CANCEL),
                        filter(({ dataEntryId: cancelDataEntryId }) => cancelDataEntryId === dataEntryId),
                    )),
                );
        }),
    );
