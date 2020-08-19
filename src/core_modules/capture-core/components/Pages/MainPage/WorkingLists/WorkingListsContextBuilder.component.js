// @flow
import * as React from 'react';
import {
    ManagerContext,
    ListViewConfigContext,
    ListViewLoaderContext,
    ListViewBuilderContext,
} from './workingLists.context';
import TemplatesLoader from './TemplatesLoader.component';
import type { DataSource } from './workingLists.types';

type PassOnProps = {|
    onLoadTemplates: Function,
    onCancelLoadTemplates: Function,
    programId: string,
    loadTemplatesError: Function,
    templatesForProgramId: ?string,
    templatesAreLoading: boolean,
|};

type Props = {
    listId: string,
    templates: ?Object,
    currentTemplate: ?Object,
    onSelectTemplate: Function,
    onLoadEventList: Function,
    loadEventListError: ?string,
    onUpdateEventList: Function,
    onCancelLoadEventList: Function,
    onCancelUpdateEventList: Function,
    listMeta: ?Object,
    columnOrder: ?Array<Object>,
    isLoading: boolean,
    isUpdating: boolean,
    isUpdatingWithDialog: boolean,
    onAddTemplate: Function,
    onUpdateTemplate: Function,
    onDeleteTemplate: Function,
    convertToEventFilterQueryCriteria: Function,
    onCleanSkipInitAddingTemplate: Function,
    onUnloadingContext: Function,
    orgUnitId: string,
    categories: Object,
    lastTransaction: number,
    listContext: ?Object,
    onCheckSkipReload: Function,
    lastEventIdDeleted: ?string,
    dataSource: DataSource,
    recordsOrder: Array<string>,
    onListRowSelect: Function,
    onSortList: Function,
    onSetListColumnOrder: Function,
    customRowMenuContents: Object,
    ...PassOnProps,
};

const WorkingListsContextBuilder = (props: Props) => {
    const {
        listId,
        templates: allTemplates,
        currentTemplate,
        onSelectTemplate,
        onLoadEventList,
        loadEventListError,
        onUpdateEventList,
        onCancelLoadEventList,
        onCancelUpdateEventList,
        listMeta,
        columnOrder,
        isLoading,
        isUpdating,
        isUpdatingWithDialog,
        onAddTemplate,
        onUpdateTemplate,
        onDeleteTemplate,
        convertToEventFilterQueryCriteria,
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
        onSortList,
        customRowMenuContents,
        onSetListColumnOrder,
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
        listMeta,
        columnOrder,
        onAddTemplate,
        onUpdateTemplate,
        onDeleteTemplate,
        convertToEventFilterQueryCriteria,
    }), [
        listMeta,
        columnOrder,
        onAddTemplate,
        onUpdateTemplate,
        onDeleteTemplate,
        convertToEventFilterQueryCriteria,
    ]);

    const listViewLoaderContextData = React.useMemo(() => ({
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

    const listViewBuilderContextData = React.useMemo(() => ({
        isUpdating,
        columnOrder,
        dataSource,
        recordsOrder,
        onListRowSelect,
        onSortList,
        onSetListColumnOrder,
        customRowMenuContents,
    }), [
        isUpdating,
        columnOrder,
        dataSource,
        recordsOrder,
        onListRowSelect,
        onSortList,
        onSetListColumnOrder,
        customRowMenuContents,
    ]);

    const templates = React.useMemo(() =>
        allTemplates && allTemplates.filter(t => !t.deleted), [
        allTemplates,
    ]);

    React.useEffect(() => {
        return () => onUnloadingContext(listId);
    }, [
        onUnloadingContext,
        listId,
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
                    <ListViewBuilderContext.Provider
                        value={listViewBuilderContextData}
                    >
                        <TemplatesLoader
                            {...passOnProps}
                            templates={templates}
                            listId={listId}
                            dirtyTemplates={!!dirtyTemplatesStateFirstRunRef.current}
                        />
                    </ListViewBuilderContext.Provider>
                </ListViewLoaderContext.Provider>
            </ListViewConfigContext.Provider>
        </ManagerContext.Provider>
    );
};

export default WorkingListsContextBuilder;
