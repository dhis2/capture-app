// @flow
import log from 'loglevel';
import i18n from '@dhis2/d2-i18n';
import { from } from 'rxjs';
import { errorCreator } from 'capture-core-utils';
import { ofType } from 'redux-observable';
import { concatMap, filter, takeUntil } from 'rxjs/operators';
import {
    workingListsCommonActionTypes,
    addTemplateSuccess,
    addTemplateError,
    deleteTemplateSuccess,
    deleteTemplateError,
    fetchTemplatesSuccess,
    fetchTemplatesError,
    updateTemplateSuccess,
    updateTemplateError,
} from '../../../WorkingListsCommon';
import { getTemplates } from './getTemplates';
import { TEI_WORKING_LISTS_TYPE } from '../../constants';

export const retrieveTemplatesEpic = (action$: InputObservable, store: ReduxStore, { querySingleResource }: ApiUtils) =>
    action$.pipe(
        ofType(workingListsCommonActionTypes.TEMPLATES_FETCH),
        filter(({ payload: { workingListsType } }) => workingListsType === TEI_WORKING_LISTS_TYPE),
        concatMap(({ payload: { storeId, programId } }) => {
            const promise = getTemplates(programId, querySingleResource)
                .then(({ templates, defaultTemplateId }) => fetchTemplatesSuccess(templates, defaultTemplateId, storeId))
                .catch((error) => {
                    log.error(errorCreator(error)({ epic: 'retrieveTemplatesEpic' }));
                    return fetchTemplatesError(i18n.t('an error occurred loading Tracked entity instance lists'), storeId);
                });

            return from(promise).pipe(
                takeUntil(
                    action$.pipe(
                        ofType(workingListsCommonActionTypes.TEMPLATES_FETCH_CANCEL),
                        filter(cancelAction => cancelAction.payload.storeId === storeId),
                    ),
                ),
            );
        }),
    );

export const addTemplateEpic = (action$: InputObservable, store: ReduxStore, { mutate }: ApiUtils) =>
    action$.pipe(
        ofType(workingListsCommonActionTypes.TEMPLATE_ADD),
        filter(({ payload: { workingListsType } }) => workingListsType === TEI_WORKING_LISTS_TYPE),
        concatMap((action) => {
            const {
                name,
                program,
                storeId,
                clientId,
                criteria: {
                    programStatus,
                    enrolledAt,
                    occurredAt,
                    attributeValueFilters,
                    order,
                    displayOrderColumns,
                    assignedUserMode,
                    assignedUsers,
                },
            } = action.payload;
            const trackedEntityInstanceFilters = {
                name,
                program,
                order,
                displayOrderColumns,
                ...(assignedUserMode && { assignedUserMode }),
                ...(assignedUsers?.length > 0 && { assignedUsers }),
                ...(programStatus && { enrollmentStatus: programStatus }),
                ...(enrolledAt && { enrollmentCreatedPeriod: enrolledAt }),
                ...(occurredAt && { incidentDate: occurredAt }),
                ...(attributeValueFilters?.length > 0 && { attributeValueFilters }),
            };

            const requestPromise = mutate({
                resource: 'trackedEntityInstanceFilters',
                type: 'create',
                data: trackedEntityInstanceFilters,
            })
                .then((result) => {
                    const isActiveTemplate = store.value.workingListsTemplates[storeId].selectedTemplateId === clientId;
                    return addTemplateSuccess(result.response.uid, clientId, { storeId, isActiveTemplate });
                })
                .catch((error) => {
                    log.error(
                        errorCreator('could not add template')({
                            error,
                            trackedEntityInstanceFilters,
                        }),
                    );
                    const isActiveTemplate = store.value.workingListsTemplates[storeId].selectedTemplateId === clientId;
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
        }),
    );

export const deleteTemplateEpic = (action$: InputObservable, store: ReduxStore, { mutate }: ApiUtils) =>
    action$.pipe(
        ofType(workingListsCommonActionTypes.TEMPLATE_DELETE),
        filter(({ payload: { workingListsType } }) => workingListsType === TEI_WORKING_LISTS_TYPE),
        concatMap(({ payload: { template, storeId } }) => {
            const requestPromise = mutate({
                resource: 'trackedEntityInstanceFilters',
                id: template.id,
                type: 'delete',
            })
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
        }),
    );

export const updateTemplateEpic = (action$: InputObservable, store: ReduxStore, { mutate }: ApiUtils) =>
    action$.pipe(
        ofType(workingListsCommonActionTypes.TEMPLATE_UPDATE),
        filter(({ payload: { workingListsType } }) => workingListsType === TEI_WORKING_LISTS_TYPE),
        concatMap((action) => {
            const {
                template: { id, name, externalAccess, publicAccess, user, userGroupAccesses, userAccesses },
                program,
                storeId,
                criteria,
            } = action.payload;

            const { programStatus, enrolledAt, occurredAt, attributeValueFilters, order, displayOrderColumns, assignedUserMode, assignedUsers } =
                criteria;

            const trackedEntityInstanceFilters = {
                name,
                program,
                order,
                displayOrderColumns,
                externalAccess,
                publicAccess,
                user,
                userGroupAccesses,
                userAccesses,
                ...(assignedUserMode && { assignedUserMode }),
                ...(assignedUsers?.length > 0 && { assignedUsers }),
                ...(programStatus && { enrollmentStatus: programStatus }),
                ...(enrolledAt && { enrollmentCreatedPeriod: enrolledAt }),
                ...(occurredAt && { incidentDate: occurredAt }),
                ...(attributeValueFilters?.length > 0 && { attributeValueFilters }),
            };

            const requestPromise = mutate({
                resource: 'trackedEntityInstanceFilters',
                id,
                type: 'replace',
                data: trackedEntityInstanceFilters,
            })
                .then(() => {
                    const isActiveTemplate = store.value.workingListsTemplates[storeId].selectedTemplateId === id;
                    return updateTemplateSuccess(id, criteria, {
                        storeId,
                        isActiveTemplate,
                    });
                })
                .catch((error) => {
                    log.error(
                        errorCreator('could not update template')({
                            error,
                            trackedEntityInstanceFilters,
                        }),
                    );
                    const isActiveTemplate = store.value.workingListsTemplates[storeId].selectedTemplateId === id;
                    return updateTemplateError(id, criteria, {
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
        }),
    );
