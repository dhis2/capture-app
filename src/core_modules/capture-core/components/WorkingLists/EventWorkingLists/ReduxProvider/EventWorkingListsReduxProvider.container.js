// @flow
import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    openViewEventPage,
    requestDeleteEvent,
} from '../eventWorkingLists.actions';
import { EventWorkingListsColumnSetup } from '../ColumnSetup';
import { useWorkingListsCommonStateManagement, TEMPLATE_SHARING_TYPE } from '../../WorkingListsCommon';
import { SINGLE_EVENT_WORKING_LISTS_TYPE } from '../constants';
import type { Props } from './eventWorkingListsReduxProvider.types';

export const EventWorkingListsReduxProvider = ({ storeId, program, programStage, orgUnitId }: Props) => {
    const dispatch = useDispatch();

    const { currentTemplateId, templates, ...commonStateManagementRestProps }
        = useWorkingListsCommonStateManagement(storeId, SINGLE_EVENT_WORKING_LISTS_TYPE, program);

    const currentTemplate = currentTemplateId && templates &&
    templates.find(template => template.id === currentTemplateId);

    const lastEventIdDeleted = useSelector(({ workingListsUI }) =>
        workingListsUI[storeId] && workingListsUI[storeId].lastEventIdDeleted);

    const downloadRequest = useSelector(({ workingLists }) =>
        workingLists[storeId] && workingLists[storeId].currentRequest); // TODO: Remove when DownloadDialog is rewritten

    const onSelectListRow = useCallback(({ id }) => {
        window.scrollTo(0, 0);
        dispatch(openViewEventPage(id, program?.id, orgUnitId));
    }, [dispatch, program, orgUnitId]);

    const onDeleteEvent = useCallback((eventId: string) => {
        dispatch(requestDeleteEvent(eventId, storeId));
    }, [dispatch, storeId]);

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
            onDeleteEvent={onDeleteEvent}
            downloadRequest={downloadRequest}
        />
    );
};
