// @flow
import React, { useMemo, useRef, useEffect } from 'react';
import {
    ManagerContext,
    ListViewConfigContext,
    ListViewLoaderContext,
    ListViewUpdaterContext,
    ListViewBuilderContext,
} from './workingLists.context';
import TemplatesLoader from './TemplatesLoader.component';
import type {
    DataSource,
    ColumnConfigs,
    LoadedContext,
    WorkingListTemplates,
    WorkingListTemplate,
    Categories,
} from './workingLists.types';
import type { FiltersData, CustomRowMenuContents, StickyFilters } from '../../../ListView';

type Props<InputDataSource> = {
    templates?: WorkingListTemplates,
    currentTemplate?: WorkingListTemplate,
    onSelectTemplate: Function,
    onLoadView: Function,
    loadViewError?: string,
    onUpdateList: Function,
    onCancelLoadView?: Function,
    onCancelUpdateList?: Function,
    columns: ColumnConfigs,
    loading: boolean,
    updating: boolean,
    updatingWithDialog: boolean,
    onAddTemplate: Function,
    onUpdateTemplate: Function,
    onDeleteTemplate: Function,
    onCleanSkipInitAddingTemplate: Function,
    onUnloadingContext?: Function,
    orgUnitId: string,
    categories?: Categories,
    lastTransaction: number,
    loadedContext?: LoadedContext,
    onCheckSkipReload: Function,
    lastIdDeleted?: string,
    dataSource?: DataSource,
    recordsOrder?: Array<string>,
    onSelectListRow: Function,
    sortById?: string,
    sortByDirection?: string,
    onSortList: Function,
    onSetListColumnOrder: Function,
    customRowMenuContents?: CustomRowMenuContents<InputDataSource>,
    filters?: FiltersData,
    onUpdateFilter: Function,
    onClearFilter: Function,
    onSelectRestMenuItem: Function,
    onChangePage: Function,
    onChangeRowsPerPage: Function,
    stickyFilters?: StickyFilters,
    rowsPerPage?: number,
    currentPage?: number,
    rowsCount?: number,
    currentViewHasTemplateChanges?: boolean,
};

const WorkingListsContextBuilder = <InputDataSource>(props: Props<InputDataSource>) => { // eslint-disable-line
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

export default WorkingListsContextBuilder;
