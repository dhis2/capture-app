// @flow
import { from, of } from 'rxjs';
import { catchError, concatMap, takeUntil, filter, map } from 'rxjs/operators';
import { ofType } from 'redux-observable';
import log from 'loglevel';
import { errorCreator } from 'capture-core-utils';
import type { RenderFoundation } from '../../../metaData';
import { convertFormToClient, convertClientToServer } from '../../../converters';
import getDataEntryKey from '../../DataEntry/common/getDataEntryKey';
import { checkForDuplicateActionTypes, checkForDuplicateSuccess, checkForDuplicateError } from './checkForDuplicate.actions';

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
                    catchError((error) => {
                        log.error(errorCreator('duplicate check api request failed')({ searchValues, searchContext, error }));
                        return of(checkForDuplicateError(dataEntryId));
                    }),
                    takeUntil(action$.pipe(
                        ofType(checkForDuplicateActionTypes.DUPLICATE_CHECK_RESET, checkForDuplicateActionTypes.DUPLICATE_CHECK_CANCEL),
                        filter(({ dataEntryId: cancelDataEntryId }) => cancelDataEntryId === dataEntryId),
                    )),
                );
        }),
    );
