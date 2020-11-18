// @flow
import React, { useMemo } from 'react';
import {
    ListViewUpdaterContext,
} from '../../workingLists.context';
import type { Props } from './workingListsListViewUpdaterContextProvider.types';

export const WorkingListsListViewUpdaterContextProvider = ({
    rowsPerPage,
    currentPage,
    onCancelUpdateList,
    customUpdateTrigger,
    forceUpdateOnMount,
    dirtyList,
    children,
}: Props) => {
    const listViewUpdaterContextData = useMemo(() => ({
        rowsPerPage,
        currentPage,
        onCancelUpdateList,
        customUpdateTrigger,
        forceUpdateOnMount,
        dirtyList,
    }), [
        rowsPerPage,
        currentPage,
        onCancelUpdateList,
        customUpdateTrigger,
        forceUpdateOnMount,
        dirtyList,
    ]);

    return (
        <ListViewUpdaterContext.Provider
            value={listViewUpdaterContextData}
        >
            {children}
        </ListViewUpdaterContext.Provider>
    );
};
