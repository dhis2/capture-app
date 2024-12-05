// @flow
import React, { useMemo, useRef, useEffect } from 'react';
import {
    WorkingListsManagerContextProvider,
    WorkingListsListViewConfigContextProvider,
    WorkingListsListViewLoaderContextProvider,
    WorkingListsListViewUpdaterContextProvider,
    WorkingListsListViewBuilderContextProvider,
} from './ContextProviders';
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
        onRemoveFilter,
        onSelectRestMenuItem,
        onChangePage,
        onChangeRowsPerPage,
        stickyFilters,
        rowsPerPage,
        currentPage,
        currentViewHasTemplateChanges,
        viewPreloaded,
        customUpdateTrigger,
        forceUpdateOnMount,
        programStageId,
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
        categories: loadedContextDefined.categories,
    }), [
        loadedContextDefined.programIdView,
        loadedContextDefined.categories,
    ]);

    const templates = useMemo(() =>
        allTemplates && allTemplates.filter(t => !t.deleted), [
        allTemplates,
    ]);

    useEffect(() => () => onUnloadingContext && onUnloadingContext(), [
        onUnloadingContext,
    ]);

    return (
        <WorkingListsManagerContextProvider
            currentTemplate={currentTemplate}
            onSelectTemplate={onSelectTemplate}
        >
            <WorkingListsListViewConfigContextProvider
                currentViewHasTemplateChanges={currentViewHasTemplateChanges}
                onAddTemplate={onAddTemplate}
                onUpdateTemplate={onUpdateTemplate}
                onDeleteTemplate={onDeleteTemplate}
            >
                <WorkingListsListViewLoaderContextProvider
                    sortById={sortById}
                    sortByDirection={sortByDirection}
                    filters={filters}
                    columns={columns}
                    loading={loading}
                    onLoadView={onLoadView}
                    loadViewError={loadViewError}
                    onUpdateList={onUpdateList}
                    onCancelLoadView={onCancelLoadView}
                    orgUnitId={orgUnitId}
                    categories={categories}
                    dirtyView={dirtyTemplatesStateFirstRunRef.current || dirtyViewStateFirstRunRef.current}
                    loadedViewContext={loadedViewContext}
                    viewPreloaded={viewPreloaded}
                >
                    <WorkingListsListViewUpdaterContextProvider
                        rowsPerPage={rowsPerPage}
                        currentPage={currentPage}
                        onCancelUpdateList={onCancelUpdateList}
                        customUpdateTrigger={customUpdateTrigger}
                        forceUpdateOnMount={forceUpdateOnMount}
                        dirtyList={dirtyListStateFirstRunRef.current}
                        loadedOrgUnitId={loadedContextDefined.orgUnitId}
                    >
                        <WorkingListsListViewBuilderContextProvider
                            updating={updating}
                            updatingWithDialog={updatingWithDialog}
                            dataSource={dataSource}
                            onSelectListRow={onSelectListRow}
                            onSortList={onSortList}
                            onSetListColumnOrder={onSetListColumnOrder}
                            customRowMenuContents={customRowMenuContents}
                            onUpdateFilter={onUpdateFilter}
                            onClearFilter={onClearFilter}
                            onRemoveFilter={onRemoveFilter}
                            onSelectRestMenuItem={onSelectRestMenuItem}
                            onChangePage={onChangePage}
                            onChangeRowsPerPage={onChangeRowsPerPage}
                            stickyFilters={stickyFilters}
                            programStageId={programStageId}
                        >
                            <TemplatesLoader
                                {...passOnProps}
                                templates={templates}
                                dirtyTemplates={!!dirtyTemplatesStateFirstRunRef.current}
                                loadedProgramIdForTemplates={loadedProgramIdForTemplates}
                                programStageId={programStageId}
                            />
                        </WorkingListsListViewBuilderContextProvider>
                    </WorkingListsListViewUpdaterContextProvider>
                </WorkingListsListViewLoaderContextProvider>
            </WorkingListsListViewConfigContextProvider>
        </WorkingListsManagerContextProvider>
    );
};
