// @flow
import React, { useMemo } from 'react';
import {
    ListViewConfigContext,
} from '../../workingLists.context';
import type { Props } from './workingListsListViewConfigContextProvider.types';

export const WorkingListsListViewConfigContextProvider = ({
    currentViewHasTemplateChanges,
    onAddTemplate,
    onUpdateTemplate,
    onDeleteTemplate,
    children,
}: Props) => {
    const listViewConfigContextData = useMemo(() => ({
        currentViewHasTemplateChanges,
        onAddTemplate,
        onUpdateTemplate,
        onDeleteTemplate,
    }), [
        currentViewHasTemplateChanges,
        onAddTemplate,
        onUpdateTemplate,
        onDeleteTemplate,
    ]);

    return (
        <ListViewConfigContext.Provider
            value={listViewConfigContextData}
        >
            {children}
        </ListViewConfigContext.Provider>
    );
};
