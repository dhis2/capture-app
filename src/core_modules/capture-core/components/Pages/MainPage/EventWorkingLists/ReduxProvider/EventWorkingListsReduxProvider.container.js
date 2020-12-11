// @flow
import React, { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { openViewEventPage, requestDeleteEvent } from '../eventWorkingLists.actions';
import { EventWorkingListsColumnSetup } from '../ColumnSetup';
import { useWorkingListsCommonStateManagement } from '../../WorkingListsCommon';
import { getEventProgramThrowIfNotFound } from '../../../../../metaData';
import { SINGLE_EVENT_WORKING_LISTS_TYPE } from '../constants';
import type { Props } from './eventWorkingListsReduxProvider.types';

export const EventWorkingListsReduxProvider = ({ storeId }: Props) => {
  const dispatch = useDispatch();

  const programId = useSelector(({ currentSelections }) => currentSelections.programId);
  const program = useMemo(() => getEventProgramThrowIfNotFound(programId), [programId]);

  const commonStateManagementProps = useWorkingListsCommonStateManagement(
    storeId,
    SINGLE_EVENT_WORKING_LISTS_TYPE,
    program,
  );

  const lastEventIdDeleted = useSelector(
    ({ workingListsUI }) => workingListsUI[storeId] && workingListsUI[storeId].lastEventIdDeleted,
  );

  const downloadRequest = useSelector(
    ({ workingLists }) => workingLists[storeId] && workingLists[storeId].currentRequest,
  ); // TODO: Remove when DownloadDialog is rewritten

  const onSelectListRow = useCallback(
    ({ eventId }) => {
      window.scrollTo(0, 0);
      dispatch(openViewEventPage(eventId));
    },
    [dispatch],
  );

  const onDeleteEvent = useCallback(
    (eventId: string) => {
      dispatch(requestDeleteEvent(eventId, storeId));
    },
    [dispatch, storeId],
  );

  return (
    <EventWorkingListsColumnSetup
      {...commonStateManagementProps}
      program={program}
      lastIdDeleted={lastEventIdDeleted}
      onSelectListRow={onSelectListRow}
      onDeleteEvent={onDeleteEvent}
      downloadRequest={downloadRequest}
    />
  );
};
