// @flow
import React, { useCallback, useMemo } from 'react';
// $FlowFixMe
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import {
    openViewEventPage,
    requestDeleteEvent,
} from '../eventWorkingLists.actions';
import { EventWorkingListsColumnSetup } from '../ColumnSetup';
import { useWorkingListsCommonStateManagement } from '../../WorkingListsCommon';
import { getEventProgramThrowIfNotFound } from '../../../../../metaData';
import type { Props } from './eventWorkingListsRedux.types';

export const EventWorkingListsRedux = ({ listId, ...passOnProps }: Props) => {
    const dispatch = useDispatch();

    const programId = useSelector(({ currentSelections }) => currentSelections.programId);
    const program = useMemo(() => getEventProgramThrowIfNotFound(programId),
        [programId]);

    const commonStateManagementProps = useWorkingListsCommonStateManagement(listId, program);

    const eventsValues = useSelector(({
        events: eventsMainProperties, eventsValues: eventsDataElementValues }) => ({
        eventsMainProperties, eventsDataElementValues }), shallowEqual);

    const lastEventIdDeleted = useSelector(({ workingListsUI }) =>
        workingListsUI[listId] && workingListsUI[listId].lastEventIdDeleted);

    const downloadRequest = useSelector(({ workingLists }) =>
        workingLists[listId] && workingLists[listId].currentRequest); // TODO: Remove when DownloadDialog is rewritten

    const onSelectListRow = useCallback(({ eventId }) => {
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
            program={program}
            {...eventsValues}
            lastIdDeleted={lastEventIdDeleted} // TODO: New logic
            onSelectListRow={onSelectListRow}
            onDeleteEvent={onDeleteEvent}
            downloadRequest={downloadRequest}
        />
    );
};
