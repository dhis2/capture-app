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
        onUnloadingContext,
        orgUnitId,
        categories,
        loadedContext,
        dataSource,
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
        viewPreloaded,
        customUpdateTrigger,
        forceUpdateOnMount,
        ...passOnProps
    } = props;

    const dirtyTemplates = useMemo(() => (allTemplates ? allTemplates
        .some(template => template.updating || template.notPreserved || template.deleted) : false), [allTemplates]);
    const dirtyTemplatesStateFirstRunRef = useRef(dirtyTemplates);
    const dirtyViewStateFirstRunRef = useRef(loading);
    const dirtyListStateFirstRunRef = useRef(updating || updatingWithDialog);

    const loadedContextDefined = useMemo(() => loadedContext || {}, [
        loadedContext,
    ]);

    const loadedProgramIdForTemplates = useMemo(() => loadedContextDefined.programIdTemplates, [
        loadedContextDefined.programIdTemplates,
    ]);

    const loadedViewContext = useMemo(() => ({
        programId: loadedContextDefined.programIdView,
        orgUnitId: loadedContextDefined.orgUnitId,
        categories: loadedContextDefined.categories,
    }), [
        loadedContextDefined.programIdView,
        loadedContextDefined.orgUnitId,
        loadedContextDefined.categories,
    ]);

    const managerContextData = useMemo(() => ({
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
        orgUnitId,
        categories,
        dirtyView: dirtyTemplatesStateFirstRunRef.current || dirtyViewStateFirstRunRef.current,
        loadedViewContext,
        viewPreloaded,
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
        orgUnitId,
        categories,
        loadedViewContext,
        viewPreloaded,
    ]);

    const listViewUpdaterContextData = useMemo(() => ({
        rowsPerPage,
        currentPage,
        onCancelUpdateList,
        customUpdateTrigger,
        forceUpdateOnMount,
        dirtyList: dirtyListStateFirstRunRef.current,
    }), [rowsPerPage, currentPage, onCancelUpdateList, customUpdateTrigger, forceUpdateOnMount]);

    const listViewBuilderContextData = useMemo(() => ({
        updating,
        updatingWithDialog,
        dataSource,
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
        updatingWithDialog,
        dataSource,
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

    return (
        <ManagerContext.Provider
            value={managerContextData}
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
                                loadedProgramIdForTemplates={loadedProgramIdForTemplates}
                            />
                        </ListViewBuilderContext.Provider>
                    </ListViewUpdaterContext.Provider>
                </ListViewLoaderContext.Provider>
            </ListViewConfigContext.Provider>
        </ManagerContext.Provider>
    );
};
