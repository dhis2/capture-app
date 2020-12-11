// @flow
import React, { useMemo } from 'react';
import { ListViewLoaderContext } from '../../workingLists.context';
import type { Props } from './workingListsListViewLoaderContextProvider.types';

export const WorkingListsListViewLoaderContextProvider = ({
  sortById,
  sortByDirection,
  filters,
  columns,
  loading,
  onLoadView,
  loadViewError,
  onUpdateList,
  onCancelLoadView,
  orgUnitId,
  categories,
  dirtyView,
  loadedViewContext,
  viewPreloaded,
  children,
}: Props) => {
  const listViewLoaderContextData = useMemo(
    () => ({
      sortById,
      sortByDirection,
      filters,
      columns,
      loading,
      onLoadView,
      loadViewError,
      onUpdateList,
      onCancelLoadView,
      orgUnitId,
      categories,
      dirtyView,
      loadedViewContext,
      viewPreloaded,
    }),
    [
      sortById,
      sortByDirection,
      filters,
      columns,
      loading,
      onLoadView,
      loadViewError,
      onUpdateList,
      onCancelLoadView,
      orgUnitId,
      categories,
      dirtyView,
      loadedViewContext,
      viewPreloaded,
    ],
  );

  return (
    <ListViewLoaderContext.Provider value={listViewLoaderContextData}>
      {children}
    </ListViewLoaderContext.Provider>
  );
};
