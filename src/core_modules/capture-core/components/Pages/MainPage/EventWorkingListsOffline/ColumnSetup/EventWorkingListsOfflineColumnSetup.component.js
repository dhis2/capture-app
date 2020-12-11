// @flow
import React, { useMemo } from 'react';
import { useDefaultColumnConfig, useColumns } from '../../EventWorkingListsCommon';
import { EventWorkingListsOfflineDataSourceSetup } from '../DataSourceSetup';
import type { Props } from './eventWorkingListsOfflineColumnSetup.types';

export const EventWorkingListsOfflineColumnSetup = ({
  program,
  customColumnOrder,
  ...passOnProps
}: Props) => {
  const defaultColumns = useDefaultColumnConfig(program);
  const columns = useColumns(customColumnOrder, defaultColumns);
  const visibleColumns = useMemo(() => columns.filter((column) => column.visible), [columns]);

  return <EventWorkingListsOfflineDataSourceSetup {...passOnProps} columns={visibleColumns} />;
};
