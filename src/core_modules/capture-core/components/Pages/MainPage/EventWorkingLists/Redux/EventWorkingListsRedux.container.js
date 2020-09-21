// @flow
import React, { useCallback } from 'react';
// $FlowFixMe
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import {
    openViewEventPage,
    requestDeleteEvent,
} from '../eventWorkingLists.actions';
import { EventWorkingListsColumnSetup } from '../ColumnSetup';
import { useWorkingListsCommonStateManagement } from '../../WorkingListsCommon';
import type { Props } from './eventWorkingListsRedux.types';

export const EventWorkingListsRedux = ({ listId, ...passOnProps }: Props) => {
    const dispatch = useDispatch();

    const commonStateManagementProps = useWorkingListsCommonStateManagement(listId);

    const eventsValues = useSelector(({
        events: eventsMainProperties, eventsValues: eventsDataElementValues }) => ({
        eventsMainProperties, eventsDataElementValues }), shallowEqual);

    const lastEventIdDeleted = useSelector(({ workingListsUI }) =>
        workingListsUI[listId] && workingListsUI[listId].lastEventIdDeleted);

    const downloadRequest = useSelector(({ workingLists }) =>
        workingLists[listId] && workingLists[listId].currentRequest); // TODO: Remove when DownloadDialog is rewritten

    const onListRowSelect = useCallback(() => ({ eventId }) => {
        window.scrollTo(0, 0);
        dispatch(openViewEventPage(eventId));
    }, [dispatch]);

    const onDeleteEvent = useCallback((eventId: string) => {
        dispatch(requestDeleteEvent(eventId));
    }, [dispatch]);

    return (
        <EventWorkingListsColumnSetup
            {...passOnProps}
            {...commonStateManagementProps}
            {...eventsValues}
            lastEventIdDeleted={lastEventIdDeleted}
            onListRowSelect={onListRowSelect}
            onDeleteEvent={onDeleteEvent}
            downloadRequest={downloadRequest}
        />
    );
};
