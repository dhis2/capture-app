// @flow
import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useDataEngine } from '@dhis2/app-runtime';
import { makeQuerySingleResource } from 'capture-core/utils/api';
import {
    openViewEventPage,
    requestDeleteEvent,
} from '../eventWorkingLists.actions';
import { EventWorkingListsColumnSetup } from '../ColumnSetup';
import { useWorkingListsCommonStateManagement, TEMPLATE_SHARING_TYPE } from '../../WorkingListsCommon';
import { SINGLE_EVENT_WORKING_LISTS_TYPE } from '../constants';
import type { Props } from './eventWorkingListsReduxProvider.types';
import { computeDownloadRequest } from './downloadRequest';
import { convertToClientConfig } from '../helpers/eventFilters';

export const EventWorkingListsReduxProvider = ({ storeId, program, programStage, orgUnitId }: Props) => {
    const dispatch = useDispatch();
    const dataEngine = useDataEngine();

    const {
        currentTemplateId,
        templates,
        onLoadView,
        onUpdateList,
        onResetListColumnOrder,
        onClearFilters,
        onUpdateDefaultTemplate,
        ...commonStateManagementRestProps
    } = useWorkingListsCommonStateManagement(storeId, SINGLE_EVENT_WORKING_LISTS_TYPE, program);

    const currentTemplate = currentTemplateId && templates &&
    templates.find(template => template.id === currentTemplateId);

    const lastEventIdDeleted = useSelector(({ workingListsUI }) =>
        workingListsUI[storeId] && workingListsUI[storeId].lastEventIdDeleted);

    const downloadRequest = useSelector(({ workingLists }) =>
        workingLists[storeId] && workingLists[storeId].currentRequest); // TODO: Remove when DownloadDialog is rewritten

    const onSelectListRow = useCallback(({ id }) => {
        window.scrollTo(0, 0);
        dispatch(openViewEventPage(id));
    }, [dispatch]);

    const onDeleteEvent = useCallback((eventId: string) => {
        dispatch(requestDeleteEvent(eventId, storeId));
    }, [dispatch, storeId]);

    const injectDownloadRequestToLoadView = useCallback(
        async (selectedTemplate: Object, context: Object, meta: Object) => {
            const eventQueryCriteria = selectedTemplate?.nextCriteria || selectedTemplate?.criteria;
            const querySingleResource = makeQuerySingleResource(dataEngine.query.bind(dataEngine));
            const clientConfig = await convertToClientConfig(eventQueryCriteria, meta?.columnsMetaForDataFetching, querySingleResource);
            const currentRequest = computeDownloadRequest({
                clientConfig,
                context: {
                    programId: context.programId,
                    categories: context.categories,
                    programStageId: context.programStageId,
                    orgUnitId,
                    storeId,
                    program,
                },
                meta: { columnsMetaForDataFetching: meta.columnsMetaForDataFetching },
            });
            return onLoadView(selectedTemplate, { ...context, currentRequest }, meta);
        },
        [onLoadView, orgUnitId, storeId, program, dataEngine],
    );

    const injectDownloadRequestToUpdateList = useCallback(
        (queryArgs: Object, meta: Object) => {
            const { lastTransaction, columnsMetaForDataFetching } = meta;
            const currentRequest = computeDownloadRequest({
                clientConfig: queryArgs,
                context: {
                    programId: queryArgs.programId,
                    categories: queryArgs.categories,
                    programStageId: queryArgs.programStageId,
                    orgUnitId,
                    storeId,
                    program,
                },
                meta: { columnsMetaForDataFetching },
            });
            return onUpdateList(queryArgs, { ...meta, currentRequest }, lastTransaction);
        },
        [onUpdateList, orgUnitId, storeId, program],
    );
    return (
        <EventWorkingListsColumnSetup
            {...commonStateManagementRestProps}
            templateSharingType={TEMPLATE_SHARING_TYPE[storeId]}
            program={program}
            programStage={programStage}
            orgUnitId={orgUnitId}
            currentTemplate={currentTemplate}
            templates={templates}
            lastIdDeleted={lastEventIdDeleted}
            onSelectListRow={onSelectListRow}
            onLoadView={injectDownloadRequestToLoadView}
            onUpdateList={injectDownloadRequestToUpdateList}
            onDeleteEvent={onDeleteEvent}
            downloadRequest={downloadRequest}
        />
    );
};
