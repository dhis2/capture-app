// @flow
import * as React from 'react';
import {
    ManagerContext,
    ListViewConfigContext,
    ListViewLoaderContext,
    ListViewUpdaterContext,
    ListViewBuilderContext,
} from './workingLists.context';
import TemplatesLoader from './TemplatesLoader.component';
import type { DataSource, ColumnConfigs } from './workingLists.types';
import type { FiltersData } from '../../../ListView';

type PassOnProps = {|
    onLoadTemplates: Function,
    onCancelLoadTemplates: Function,
    programId: string,
    loadTemplatesError: Function,
    templatesForProgramId: ?string,
    templatesAreLoading: boolean,
|};

type Props = {
    templates: ?Object,
    currentTemplate: ?Object,
    onSelectTemplate: Function,
    onLoadEventList: Function,
    loadEventListError: ?string,
    onUpdateEventList: Function,
    onCancelLoadEventList: Function,
    onCancelUpdateEventList: Function,
    columns: ColumnConfigs,
    isLoading: boolean,
    isUpdating: boolean,
    isUpdatingWithDialog: boolean,
    onAddTemplate: Function,
    onUpdateTemplate: Function,
    onDeleteTemplate: Function,
    onCleanSkipInitAddingTemplate: Function,
    onUnloadingContext: Function,
    orgUnitId: string,
    categories?: Object,
    lastTransaction: number,
    listContext: ?Object,
    onCheckSkipReload: Function,
    lastEventIdDeleted: ?string,
    dataSource: DataSource,
    recordsOrder: Array<string>,
    onListRowSelect: Function,
    sortById?: string,
    sortByDirection?: string,
    onSortList: Function,
    onSetListColumnOrder: Function,
    customRowMenuContents: Object,
    filters?: FiltersData,
    onFilterUpdate: Function,
    onClearFilter: Function,
    onRestMenuItemSelected: Function,
    onChangePage: Function,
    onChangeRowsPerPage: Function,
    stickyFilters: Object,
    rowsPerPage?: number,
    currentPage?: number,
    rowsCount?: number,
    currentViewHasTemplateChanges?: boolean,
    ...PassOnProps,
};

const WorkingListsContextBuilder = (props: Props) => {
    const {
        templates: allTemplates,
        currentTemplate,
        onSelectTemplate,
        onLoadEventList,
        loadEventListError,
        onUpdateEventList,
        onCancelLoadEventList,
        onCancelUpdateEventList,
        columns,
        isLoading,
        isUpdating,
        isUpdatingWithDialog,
        onAddTemplate,
        onUpdateTemplate,
        onDeleteTemplate,
        onCleanSkipInitAddingTemplate,
        onUnloadingContext,
        orgUnitId,
        categories,
        lastTransaction,
        listContext,
        onCheckSkipReload,
        lastEventIdDeleted,
        dataSource,
        recordsOrder,
        onListRowSelect,
        sortById,
        sortByDirection,
        onSortList,
        customRowMenuContents,
        onSetListColumnOrder,
        filters,
        onFilterUpdate,
        onClearFilter,
        onRestMenuItemSelected,
        onChangePage,
        onChangeRowsPerPage,
        stickyFilters,
        rowsPerPage,
        currentPage,
        rowsCount,
        currentViewHasTemplateChanges,
        ...passOnProps
    } = props;

    const dirtyTemplatesStateFirstRunRef = React.useRef(undefined);
    React.useMemo(() => {
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

    const dirtyEventListStateFirstRunRef = React.useRef(undefined);
    React.useMemo(() => {
        if (dirtyEventListStateFirstRunRef.current !== undefined) {
            return;
        }

        if (isLoading || isUpdating || isUpdatingWithDialog) {
            dirtyEventListStateFirstRunRef.current = true;
            return;
        }

        dirtyEventListStateFirstRunRef.current = false;
    }, [
        isLoading,
        isUpdating,
        isUpdatingWithDialog,
    ]);

    const managerData = React.useMemo(() => ({
        currentTemplate,
        onSelectTemplate,
    }), [currentTemplate, onSelectTemplate]);

    const listViewConfigContextData = React.useMemo(() => ({
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

    const listViewLoaderContextData = React.useMemo(() => ({
        sortById,
        sortByDirection,
        filters,
        columns,
        isLoading,
        onLoadEventList,
        loadEventListError,
        onUpdateEventList,
        onCancelLoadEventList,
        onCancelUpdateEventList,
        onCleanSkipInitAddingTemplate,
        orgUnitId,
        categories,
        lastTransaction,
        listContext,
        onCheckSkipReload,
        lastEventIdDeleted,
        dirtyEventList: dirtyTemplatesStateFirstRunRef.current || dirtyEventListStateFirstRunRef.current,
    }), [
        sortById,
        sortByDirection,
        filters,
        columns,
        isLoading,
        onLoadEventList,
        loadEventListError,
        onUpdateEventList,
        onCancelLoadEventList,
        onCancelUpdateEventList,
        onCleanSkipInitAddingTemplate,
        orgUnitId,
        categories,
        lastTransaction,
        listContext,
        onCheckSkipReload,
        lastEventIdDeleted,
    ]);

    const listViewUpdaterContextData = React.useMemo(() => ({
        rowsPerPage,
        currentPage,
    }), [rowsPerPage, currentPage]);

    const listViewBuilderContextData = React.useMemo(() => ({
        isUpdating,
        dataSource,
        recordsOrder,
        onListRowSelect,
        onSortList,
        onSetListColumnOrder,
        customRowMenuContents,
        onFilterUpdate,
        onClearFilter,
        onRestMenuItemSelected,
        onChangePage,
        onChangeRowsPerPage,
        stickyFilters,
        rowsCount,
    }), [
        isUpdating,
        dataSource,
        recordsOrder,
        onListRowSelect,
        onSortList,
        onSetListColumnOrder,
        customRowMenuContents,
        onFilterUpdate,
        onClearFilter,
        onRestMenuItemSelected,
        onChangePage,
        onChangeRowsPerPage,
        stickyFilters,
        rowsCount,
    ]);

    const templates = React.useMemo(() =>
        allTemplates && allTemplates.filter(t => !t.deleted), [
        allTemplates,
    ]);

    React.useEffect(() => () => onUnloadingContext(), [
        onUnloadingContext,
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
                            />
                        </ListViewBuilderContext.Provider>
                    </ListViewUpdaterContext.Provider>
                </ListViewLoaderContext.Provider>
            </ListViewConfigContext.Provider>
        </ManagerContext.Provider>
    );
};

export default WorkingListsContextBuilder;
