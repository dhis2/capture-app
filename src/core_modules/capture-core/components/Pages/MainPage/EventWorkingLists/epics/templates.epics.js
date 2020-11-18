// @flow
import log from 'loglevel';
import i18n from '@dhis2/d2-i18n';
import { errorCreator } from 'capture-core-utils';
import { ofType } from 'redux-observable';
import { concatMap, filter, takeUntil } from 'rxjs/operators';
import { from } from 'rxjs';
import {
    workingListsCommonActionTypes,
    fetchTemplatesSuccess,
    fetchTemplatesError,
    updateTemplateSuccess,
    updateTemplateError,
    addTemplateSuccess,
    addTemplateError,
    deleteTemplateSuccess,
    deleteTemplateError,
} from '../../WorkingListsCommon';
import { getTemplates } from './getTemplates';
import { getApi } from '../../../../../d2';
import { SINGLE_EVENT_WORKING_LISTS_TYPE } from '../constants';

export const retrieveTemplatesEpic = (action$: InputObservable) =>
    action$.pipe(
        ofType(workingListsCommonActionTypes.TEMPLATES_FETCH),
        filter(({ payload: { workingListsType } }) => workingListsType === SINGLE_EVENT_WORKING_LISTS_TYPE),
        concatMap(({ payload: { storeId, programId } }) => {
            const promise = getTemplates(programId)
                .then(({ templates, defaultTemplateId }) =>
                    fetchTemplatesSuccess(templates, defaultTemplateId, storeId))
                .catch((error) => {
                    log.error(
                        errorCreator(error)({ epic: 'retrieveTemplatesEpic' }),
                    );
                    return fetchTemplatesError(i18n.t('an error occurred loading working lists'), storeId);
                });

            return from(promise).pipe(
                takeUntil(
                    action$.pipe(
                        ofType(workingListsCommonActionTypes.TEMPLATES_FETCH_CANCEL),
                        filter(cancelAction => cancelAction.payload.storeId === storeId),
                    ),
                ),
            );
        }));

export const updateTemplateEpic = (action$: InputObservable, store: ReduxStore) =>
    action$.pipe(
        ofType(workingListsCommonActionTypes.TEMPLATE_UPDATE),
        filter(({ payload: { workingListsType } }) => workingListsType === SINGLE_EVENT_WORKING_LISTS_TYPE),
        concatMap((action) => {
            const {
                template,
                criteria: eventQueryCriteria,
                programId,
                storeId,
            } = action.payload;

            const eventFilterData = {
                name: template.name,
                program: programId,
                eventQueryCriteria,
            };

            const api = getApi();

            const requestPromise = api
                .update(`eventFilters/${template.id}`, eventFilterData)
                .then(() => api
                    .post(`sharing?type=eventFilter&id=${template.id}`, {
                        object: {
                            publicAccess: '--------',
                            externalAccess: false,
                        },
                    })
                    .catch((error) => {
                        log.error(
                            errorCreator('could not set sharing settings for template')({
                                error,
                                eventFilterData,
                                templateId: template.id,
                            }),
                        );
                    }))
                .then(() => {
                    const isActiveTemplate =
            store.value.workingListsTemplates[storeId].selectedTemplateId === template.id;
                    return updateTemplateSuccess(
                        template.id,
                        eventQueryCriteria, {
                            storeId,
                            isActiveTemplate,
                        });
                })
                .catch((error) => {
                    log.error(
                        errorCreator('could not update template')({
                            error,
                            eventFilterData,
                        }),
                    );
                    const isActiveTemplate =
            store.value.workingListsTemplates[storeId].selectedTemplateId === template.id;
                    return updateTemplateError(
                        template.id,
                        eventQueryCriteria, {
                            storeId,
                            isActiveTemplate,
                        });
                });

            return from(requestPromise).pipe(
                takeUntil(
                    action$.pipe(
                        ofType(workingListsCommonActionTypes.TEMPLATE_UPDATE),
                        filter(cancelAction => cancelAction.payload.template.id === template.id),
                    ),
                ),
                takeUntil(
                    action$.pipe(
                        ofType(workingListsCommonActionTypes.CONTEXT_UNLOADING),
                        filter(cancelAction => cancelAction.payload.storeId === storeId),
                    ),
                ),
            );
        }));

export const addTemplateEpic = (action$: InputObservable, store: ReduxStore) =>
    action$.pipe(
        ofType(workingListsCommonActionTypes.TEMPLATE_ADD),
        filter(({ payload: { workingListsType } }) => workingListsType === SINGLE_EVENT_WORKING_LISTS_TYPE),
        concatMap((action) => {
            const {
                name,
                criteria: eventQueryCriteria,
                clientId,
                programId,
                storeId,
            } = action.payload;

            const eventFilterData = {
                name,
                program: programId,
                eventQueryCriteria,
            };

            const api = getApi();

            const requestPromise = api
                .post('eventFilters', eventFilterData)
                .then((result) => {
                    const templateId = result.response.uid;
                    return api
                        .post(`sharing?type=eventFilter&id=${templateId}`, {
                            object: {
                                publicAccess: '--------',
                                externalAccess: false,
                            },
                        })
                        .catch((error) => {
                            log.error(
                                errorCreator('could not set sharing settings for template')({
                                    error,
                                    eventFilterData,
                                    templateId,
                                }),
                            );
                        })
                        .then(() => {
                            const isActiveTemplate =
                    store.value.workingListsTemplates[storeId].selectedTemplateId === clientId;
                            return addTemplateSuccess(result.response.uid, clientId, { storeId, isActiveTemplate });
                        });
                })
                .catch((error) => {
                    log.error(
                        errorCreator('could not add template')({
                            error,
                            eventFilterData,
                        }),
                    );
                    const isActiveTemplate =
                store.value.workingListsTemplates[storeId].selectedTemplateId === clientId;
                    return addTemplateError(clientId, { storeId, isActiveTemplate });
                });

            return from(requestPromise).pipe(
                takeUntil(
                    action$.pipe(
                        ofType(workingListsCommonActionTypes.CONTEXT_UNLOADING),
                        filter(cancelAction => cancelAction.payload.storeId === storeId),
                    ),
                ),
            );
        }));

export const deleteTemplateEpic = (action$: InputObservable) =>
    action$.pipe(
        ofType(workingListsCommonActionTypes.TEMPLATE_DELETE),
        filter(({ payload: { workingListsType } }) => workingListsType === SINGLE_EVENT_WORKING_LISTS_TYPE),
        concatMap((action) => {
            const {
                template,
                storeId,
            } = action.payload;

            const requestPromise = getApi()
                .delete(`eventFilters/${template.id}`)
                .then(() => deleteTemplateSuccess(template, storeId))
                .catch((error) => {
                    log.error(
                        errorCreator('could not delete template')({
                            error,
                            template,
                        }),
                    );
                    return deleteTemplateError(template, storeId);
                });

            return from(requestPromise).pipe(
                takeUntil(
                    action$.pipe(
                        ofType(workingListsCommonActionTypes.TEMPLATE_DELETE),
                        filter(cancelAction => cancelAction.payload.template.id === template.id),
                    ),
                ),
                takeUntil(
                    action$.pipe(
                        ofType(workingListsCommonActionTypes.CONTEXT_UNLOADING),
                        filter(cancelAction => cancelAction.payload.storeId === storeId),
                    ),
                ),
            );
        }));
