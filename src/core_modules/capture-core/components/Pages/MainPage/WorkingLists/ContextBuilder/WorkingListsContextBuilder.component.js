// @flow
import React, { useMemo, useRef, useEffect } from 'react';
import {
    ManagerContext,
    ListViewConfigContext,
    ListViewLoaderContext,
    ListViewUpdaterContext,
    ListViewBuilderContext,
} from '../workingLists.context';
import { TemplatesLoader } from '../TemplatesLoader';
import type { Props } from './workingListsContextBuilder.types';


export const WorkingListsContextBuilder = (props: Props) => {
    const {
        templates: allTemplates,
        currentTemplate,
        onSelectTemplate,
        onLoadView,
        loadViewError,
        onUpdateList,
        onCancelLoadView,
        onCancelUpdateList,
        columns,
        loading,
        updating,
        updatingWithDialog,
        onAddTemplate,
        onUpdateTemplate,
        onDeleteTemplate,
        onCleanSkipInitAddingTemplate,
        onUnloadingContext,
        orgUnitId,
        categories,
        lastTransaction,
        loadedContext,
        onCheckSkipReload,
        lastIdDeleted,
        dataSource,
        recordsOrder,
        onSelectListRow,
        sortById,
        sortByDirection,
        onSortList,
        customRowMenuContents,
        onSetListColumnOrder,
        filters,
        onUpdateFilter,
        onClearFilter,
        onSelectRestMenuItem,
        onChangePage,
        onChangeRowsPerPage,
        stickyFilters,
        rowsPerPage,
        currentPage,
        rowsCount,
        currentViewHasTemplateChanges,
        ...passOnProps
    } = props;

    const dirtyTemplatesStateFirstRunRef = useRef(undefined);
    useMemo(() => {
        if (dirtyTemplatesStateFirstRunRef.current !== undefined) {
            return;
        }

        if (!allTemplates) {
            dirtyTemplatesStateFirstRunRef.current = false;
            return;
        }

        dirtyTemplatesStateFirstRunRef.current = allTemplates
            .some(template => template.nextEventQueryCriteria || template.notPreserved || template.deleted);
    }, [allTemplates]);

    const dirtyEventListStateFirstRunRef = useRef(undefined);
    useMemo(() => {
        if (dirtyEventListStateFirstRunRef.current !== undefined) {
            return;
        }

        if (loading || updating || updatingWithDialog) {
            dirtyEventListStateFirstRunRef.current = true;
            return;
        }

        dirtyEventListStateFirstRunRef.current = false;
    }, [
        loading,
        updating,
        updatingWithDialog,
    ]);

    const managerData = useMemo(() => ({
        currentTemplate,
        onSelectTemplate,
    }), [currentTemplate, onSelectTemplate]);

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

    const listViewLoaderContextData = useMemo(() => ({
        sortById,
        sortByDirection,
        filters,
        columns,
        loading,
        onLoadView,
        loadViewError,
        onUpdateList,
        onCancelLoadView,
        onCleanSkipInitAddingTemplate,
        orgUnitId,
        categories,
        lastTransaction,
        onCheckSkipReload,
        dirtyEventList: dirtyTemplatesStateFirstRunRef.current || dirtyEventListStateFirstRunRef.current,
    }), [
        sortById,
        sortByDirection,
        filters,
        columns,
        loading,
        onLoadView,
        loadViewError,
        onUpdateList,
        onCancelLoadView,
        onCleanSkipInitAddingTemplate,
        orgUnitId,
        categories,
        lastTransaction,
        onCheckSkipReload,
    ]);

    const listViewUpdaterContextData = useMemo(() => ({
        rowsPerPage,
        currentPage,
        onCancelUpdateList,
        lastIdDeleted,
    }), [rowsPerPage, currentPage, onCancelUpdateList, lastIdDeleted]);

    const listViewBuilderContextData = useMemo(() => ({
        updating,
        dataSource,
        recordsOrder,
        onSelectListRow,
        onSortList,
        onSetListColumnOrder,
        customRowMenuContents,
        onUpdateFilter,
        onClearFilter,
        onSelectRestMenuItem,
        onChangePage,
        onChangeRowsPerPage,
        stickyFilters,
        rowsCount,
    }), [
        updating,
        dataSource,
        recordsOrder,
        onSelectListRow,
        onSortList,
        onSetListColumnOrder,
        customRowMenuContents,
        onUpdateFilter,
        onClearFilter,
        onSelectRestMenuItem,
        onChangePage,
        onChangeRowsPerPage,
        stickyFilters,
        rowsCount,
    ]);

    const templates = useMemo(() =>
        allTemplates && allTemplates.filter(t => !t.deleted), [
        allTemplates,
    ]);

    useEffect(() => () => onUnloadingContext && onUnloadingContext(), [
        onUnloadingContext,
    ]);

    const loadedContextDefined = useMemo(() => loadedContext || {}, [
        loadedContext,
    ]);

    return (
        <ManagerContext.Provider
            value={managerData}
        >
            <ListViewConfigContext.Provider
                value={listViewConfigContextData}
            >
                <ListViewLoaderContext.Provider
                    value={listViewLoaderContextData}
                >
                    <ListViewUpdaterContext.Provider
                        value={listViewUpdaterContextData}
                    >
                        <ListViewBuilderContext.Provider
                            value={listViewBuilderContextData}
                        >
                            <TemplatesLoader
                                {...passOnProps}
                                templates={templates}
                                dirtyTemplates={!!dirtyTemplatesStateFirstRunRef.current}
                                loadedContext={loadedContextDefined}
                            />
                        </ListViewBuilderContext.Provider>
                    </ListViewUpdaterContext.Provider>
                </ListViewLoaderContext.Provider>
            </ListViewConfigContext.Provider>
        </ManagerContext.Provider>
    );
};
