// @flow
import log from 'loglevel';
import { from } from 'rxjs';
import { batchActions } from 'redux-batched-actions';
import { errorCreator } from 'capture-core-utils';
import { ofType } from 'redux-observable';
import { concatMap, filter, takeUntil } from 'rxjs/operators';
import {
    workingListsCommonActionTypes,
    addTemplateSuccess,
    addTemplateError,
    deleteTemplateSuccess,
    deleteTemplateError,
    updateTemplateSuccess,
    updateTemplateError,
    updateDefaultTemplate,
    workingListsCommonActionTypesBatchActionTypes,
} from '../../../WorkingListsCommon';
import { TEI_WORKING_LISTS_TYPE } from '../../constants';
import { getLocationQuery } from '../../../../../utils/routing';
import { getDefaultTemplate } from '../../helpers';

export const addProgramStageTemplateEpic = (action$: InputObservable, store: ReduxStore, { mutate }: ApiUtils) =>
    action$.pipe(
        ofType(workingListsCommonActionTypes.TEMPLATE_ADD),
        filter(
            ({ payload: { workingListsType, programStage } }) =>
                workingListsType === TEI_WORKING_LISTS_TYPE && programStage.id,
        ),
        concatMap((action) => {
            const {
                name,
                program,
                storeId,
                clientId,
                programStage,
                criteria: {
                    programStatus,
                    enrolledAt,
                    occurredAt,
                    attributeValueFilters = [],
                    dataFilters = [],
                    order,
                    followUp,
                    displayColumnOrder,
                    assignedUserMode,
                    assignedUsers,
                    status,
                    eventOccurredAt,
                    scheduledAt,
                },
                callBacks: { onChangeTemplate },
            } = action.payload;

            const programStageWorkingLists = {
                name,
                program,
                programStage,
                programStageQueryCriteria: {
                    displayColumnOrder,
                    order,
                    enrolledAt,
                    eventStatus: status,
                    ...(assignedUserMode && { assignedUserMode }),
                    ...(assignedUsers?.length > 0 && { assignedUsers }),
                    ...(followUp && { followUp }),
                    ...(programStatus && { enrollmentStatus: programStatus }),
                    ...(occurredAt && { enrollmentOccurredAt: occurredAt }),
                    ...(eventOccurredAt && { eventOccurredAt }),
                    ...(scheduledAt && { eventScheduledAt: scheduledAt }),
                    attributeValueFilters,
                    dataFilters,
                },
            };

            const requestPromise = mutate({
                resource: 'programStageWorkingLists',
                type: 'create',
                data: programStageWorkingLists,
            })
                .then((result) => {
                    const isActiveTemplate = store.value.workingListsTemplates[storeId].selectedTemplateId === clientId;
                    onChangeTemplate && onChangeTemplate(result.response.uid);

                    return batchActions([
                        addTemplateSuccess(result.response.uid, clientId, { storeId, isActiveTemplate }),
                        updateDefaultTemplate(getDefaultTemplate(program.id), storeId),
                    ], workingListsCommonActionTypesBatchActionTypes.TEMPLATE_ADD_SUCCESS);
                })
                .catch((error) => {
                    log.error(
                        errorCreator('could not add template')({
                            error,
                            programStageWorkingLists,
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

export const deleteProgramStageTemplateEpic = (action$: InputObservable, store: ReduxStore, { mutate }: ApiUtils) =>
    action$.pipe(
        ofType(workingListsCommonActionTypes.TEMPLATE_DELETE),
        filter(
            ({ payload: { workingListsType, programStageId } }) =>
                workingListsType === TEI_WORKING_LISTS_TYPE && programStageId,
        ),
        concatMap(
            ({
                payload: {
                    template,
                    storeId,
                    callBacks: { onChangeTemplate },
                },
            }) => {
                const requestPromise = mutate({
                    resource: 'programStageWorkingLists',
                    id: template.id,
                    type: 'delete',
                })
                    .then(() => {
                        const { programId } = getLocationQuery();
                        onChangeTemplate && onChangeTemplate(`${programId}-default`);

                        return deleteTemplateSuccess(template, storeId);
                    })
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
            },
        ),
    );

export const updateProgramStageTemplateEpic = (action$: InputObservable, store: ReduxStore, { mutate }: ApiUtils) =>
    action$.pipe(
        ofType(workingListsCommonActionTypes.TEMPLATE_UPDATE),
        filter(
            ({ payload: { workingListsType, programStage } }) =>
                workingListsType === TEI_WORKING_LISTS_TYPE && programStage.id,
        ),
        concatMap((action) => {
            const {
                template: { id, name, externalAccess, publicAccess, user, userGroupAccesses, userAccesses },
                program,
                programStage,
                storeId,
                criteria,
            } = action.payload;
            const {
                programStatus,
                enrolledAt,
                occurredAt,
                attributeValueFilters = [],
                dataFilters = [],
                order,
                followUp,
                displayColumnOrder,
                assignedUserMode,
                assignedUsers,
                status,
                eventOccurredAt,
                scheduledAt,
            } = criteria;

            const programStageWorkingLists = {
                name,
                program,
                programStage,
                externalAccess,
                publicAccess,
                user,
                userGroupAccesses,
                userAccesses,
                programStageQueryCriteria: {
                    displayColumnOrder,
                    order,
                    enrolledAt,
                    eventStatus: status,
                    ...(assignedUserMode && { assignedUserMode }),
                    ...(assignedUsers?.length > 0 && { assignedUsers }),
                    ...(programStatus && { enrollmentStatus: programStatus }),
                    ...(occurredAt && { enrollmentOccurredAt: occurredAt }),
                    ...(followUp && { followUp }),
                    ...(eventOccurredAt && { eventOccurredAt }),
                    ...(scheduledAt && { eventScheduledAt: scheduledAt }),
                    attributeValueFilters,
                    dataFilters,
                },
            };

            const requestPromise = mutate({
                resource: 'programStageWorkingLists',
                id,
                type: 'replace',
                data: programStageWorkingLists,
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
                            programStageWorkingLists,
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
