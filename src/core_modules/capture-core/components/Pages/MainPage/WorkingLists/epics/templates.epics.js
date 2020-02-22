// @flow
import { batchActions } from 'redux-batched-actions';
import { fromPromise } from 'rxjs/observable/fromPromise';
import i18n from '@dhis2/d2-i18n';
import log from 'loglevel';
import { errorCreator } from 'capture-core-utils';
import {
    actionTypes,
    batchActionTypes,
    fetchTemplatesSuccess,
    fetchTemplatesError,
    selectTemplate,
    updateTemplateSuccess,
    updateTemplateError,
} from '../workingLists.actions';
import { getTemplatesAsync } from './templatesFetcher';
import { convertToEventFilter } from './eventFiltersInterface';
import { getApi } from '../../../../../d2';
import type {
    ApiEventQueryCriteria,
} from '../workingLists.types';

export const retrieveTemplatesEpic = (action$: InputObservable, store: ReduxStore) =>
    action$.ofType(
        actionTypes.TEMPLATES_FETCH,
    )
        .switchMap((action) => {
            const listId = action.payload.listId;
            const promise = getTemplatesAsync(store.getState())
                .then(container => batchActions([
                    selectTemplate(container.default.id, listId, container.default),
                    fetchTemplatesSuccess(container.workingListConfigs, listId),
                ], batchActionTypes.TEMPLATES_FETCH_SUCCESS_BATCH))
                .catch((error) => {
                    log.error(
                        errorCreator(error)({ epic: 'retrieveTemplatesEpic' }),
                    );
                    return fetchTemplatesError(i18n.t('an error occurred loading working lists'), listId);
                });

            return fromPromise(promise)
                .takeUntil(
                    action$.ofType(actionTypes.TEMPLATES_FETCH_CANCEL)
                        .filter(cancelAction => cancelAction.payload.listId === listId),
                );
        });

export const updateTemplateEpic = (action$: InputObservable, store: ReduxStore) =>
    action$.ofType(
        actionTypes.TEMPLATE_UPDATE,
    )
        .concatMap((action) => {
            debugger;
            const programId = store.getState().currentSelections.programId;
            const {
                template,
                filters,
                sortById,
                sortByDirection,
                columnOrder,
                defaultConfig,
            } = action.payload;

            const eventQueryCriteria: ApiEventQueryCriteria =
                convertToEventFilter(filters, sortById, sortByDirection, columnOrder, defaultConfig);
            const eventFilterData = {
                name: template.name,
                program: programId,
                eventQueryCriteria,
            };

            const requestPromise = getApi()
                .post(`eventFilters/${template.id}`, eventFilterData)
                .then(() => updateTemplateSuccess(template.id))
                .catch((error) => {
                    log.error(
                        errorCreator('could not update template')({
                            error,
                            eventFilterData,
                        }),
                    );
                    return updateTemplateError(template.id, template.name);
                });

            return fromPromise(requestPromise)
                .takeUntil(
                    action$
                        .ofType(actionTypes.TEMPLATE_UPDATE)
                        .filter(cancelAction => cancelAction.payload.template.id === template.id),
                );
        });
