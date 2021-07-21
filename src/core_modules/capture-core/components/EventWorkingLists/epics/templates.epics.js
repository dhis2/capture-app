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
import { SINGLE_EVENT_WORKING_LISTS_TYPE } from '../constants';

export const retrieveTemplatesEpic = (
    action$: InputObservable,
    store: ReduxStore, {
        querySingleResource,
    }: ApiUtils) =>
    action$.pipe(
        ofType(workingListsCommonActionTypes.TEMPLATES_FETCH),
        filter(({ payload: { workingListsType } }) => workingListsType === SINGLE_EVENT_WORKING_LISTS_TYPE),
        concatMap(({ payload: { storeId, programId } }) => {
            const promise = getTemplates(programId, querySingleResource)
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

export const updateTemplateEpic = (
    action$: InputObservable,
    store: ReduxStore, {
        mutate,
    }: ApiUtils) =>
    action$.pipe(
        ofType(workingListsCommonActionTypes.TEMPLATE_UPDATE),
        filter(({ payload: { workingListsType } }) => workingListsType === SINGLE_EVENT_WORKING_LISTS_TYPE),
        concatMap(({ payload: {
            template: {
                id,
                name,
                externalAccess,
                publicAccess,
                user,
                userGroupAccesses,
                userAccesses,
            },
            criteria: eventQueryCriteria,
            programId,
            storeId,
        } }) => {
            const eventFilterData = {
                name,
                program: programId,
                eventQueryCriteria,
                externalAccess,
                publicAccess,
                user,
                userGroupAccesses,
                userAccesses,
            };

            const requestPromise = mutate({
                resource: 'eventFilters',
                id,
                data: eventFilterData,
                type: 'replace',
            }).then(() => {
                const isActiveTemplate =
                    store.value.workingListsTemplates[storeId].selectedTemplateId === id;

                return updateTemplateSuccess(
                    id,
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
            store.value.workingListsTemplates[storeId].selectedTemplateId === id;
                    return updateTemplateError(
                        id,
                        eventQueryCriteria, {
                            storeId,
                            isActiveTemplate,
                        });
                });

            return from(requestPromise).pipe(
                takeUntil(
                    action$.pipe(
                        ofType(workingListsCommonActionTypes.TEMPLATE_UPDATE),
                        filter(cancelAction => cancelAction.payload.template.id === id),
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

export const addTemplateEpic = (
    action$: InputObservable,
    store: ReduxStore, {
        mutate,
    }: ApiUtils) =>
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

            const requestPromise = mutate({
                resource: 'eventFilters',
                type: 'create',
                data: eventFilterData,
            }).then((result) => {
                const isActiveTemplate =
                    store.value.workingListsTemplates[storeId].selectedTemplateId === clientId;
                return addTemplateSuccess(result.response.uid, clientId, { storeId, isActiveTemplate });
            }).catch((error) => {
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

export const deleteTemplateEpic = (
    action$: InputObservable,
    store: ReduxStore, {
        mutate,
    }: ApiUtils) =>
    action$.pipe(
        ofType(workingListsCommonActionTypes.TEMPLATE_DELETE),
        filter(({ payload: { workingListsType } }) => workingListsType === SINGLE_EVENT_WORKING_LISTS_TYPE),
        concatMap(({ payload: { template, storeId } }) => {
            const requestPromise = mutate({
                resource: 'eventFilters',
                id: template.id,
                type: 'delete',
            }).then(() => deleteTemplateSuccess(template, storeId))
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
