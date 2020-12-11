// @flow
import React from 'react';
import { useDataSource } from '../../EventWorkingListsCommon';
import { createOfflineListWrapper } from '../../../../List'; // TODO: Refactor list
import type { Props } from './eventWorkingListsOfflineDataSourceSetup.types';

const OfflineListWrapper = createOfflineListWrapper();

export const EventWorkingListsOfflineDataSourceSetup = ({
  eventRecords,
  columns,
  recordsOrder,
  ...passOnProps
}: Props) => {
  const hasData = !!recordsOrder;

  return (
    <OfflineListWrapper
      {...passOnProps}
      hasData={hasData}
      dataSource={useDataSource(eventRecords, recordsOrder, columns)}
      columns={columns}
      rowIdKey="eventId"
    />
  );
};
