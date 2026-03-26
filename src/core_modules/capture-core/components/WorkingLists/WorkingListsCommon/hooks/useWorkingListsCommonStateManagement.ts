/* eslint-disable complexity */
import { useMemo, useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import type { ReduxDispatch } from 'capture-core/components/App/withAppUrlSync.types';
import {
    selectTemplate,
    addTemplate,
    updateTemplate,
    deleteTemplate,
    fetchTemplates,
    fetchTemplatesCancel,
    initListView,
    initListViewCancel,
    updateList,
    updateListCancel,
    unloadingContext,
    sortList,
    setListColumnOrder,
    resetListColumnOrder,
    setFilter,
    removeFilter,
    clearFilter,
    clearFilters,
    selectRestMenuItem,
    changePage,
    changeRowsPerPage,
    setTemplateSharingSettings,
    updateDefaultTemplate,
} from '../actions';
import type { Program } from '../../../../metaData';
import type {
    CancelLoadTemplates,
    CancelLoadView,
    CancelUpdateList,
    ChangePage,
    ChangeRowsPerPage,
    ClearFilter,
    ClearFilters,
    RemoveFilter,
    LoadTemplates,
    SelectRestMenuItem,
    SelectTemplate,
    SetColumnOrder,
    ResetColumnOrder,
    SetTemplateSharingSettings,
    SharingSettings,
    Sort,
    UpdateFilter,
} from '../../WorkingListsBase';
import type {
    AddTemplate,
    DeleteTemplate,
    UpdateTemplate,
    UpdateDefaultTemplate,
    UpdateList,
    LoadView,
    Callbacks,
} from '..';

const useTemplates = (
    dispatch: ReduxDispatch,
    { storeId, workingListsType, mainViewConfig }: { storeId: string, workingListsType: string, mainViewConfig?: any}) => {
    const templateState = useSelector(({ workingListsTemplates }: any) => {
        const {
            selectedTemplateId: currentTemplateId,
            templates,
            loading: templatesLoading,
            loadError: loadTemplatesError,
        } = workingListsTemplates[storeId] || {};

        return {
            currentTemplateId,
            templates,
            templatesLoading: !!templatesLoading,
            loadTemplatesError,
        };
    }, shallowEqual);

    const templateDispatch = useMemo((): {
            onSelectTemplate: SelectTemplate;
            onLoadTemplates: LoadTemplates;
            onCancelLoadTemplates: CancelLoadTemplates;
            onAddTemplate: AddTemplate;
            onUpdateTemplate: UpdateTemplate;
            onDeleteTemplate: DeleteTemplate;
            onSetTemplateSharingSettings: SetTemplateSharingSettings; } => ({
        onSelectTemplate: (templateId, programStageIdArg) => {
            const selectedTemplate = templateState.templates?.find(templete => templete.id === templateId);
            const programStageId = programStageIdArg || selectedTemplate?.criteria?.programStage;
            return dispatch(selectTemplate(templateId, storeId, programStageId));
        },
        onLoadTemplates: (programId: string) => dispatch(fetchTemplates({
            programId,
            storeId,
            workingListsType,
            mainViewConfig,
        })),
        onCancelLoadTemplates: () => dispatch(fetchTemplatesCancel(storeId)),
        onAddTemplate: (name: string, criteria: any, data: any, callBacks?: Callbacks) =>
            dispatch(addTemplate(
                name,
                criteria, {
                    ...data,
                    storeId,
                    workingListsType,
                },
                callBacks,
            )),
        onUpdateTemplate: (template: any, criteria: any, data: any) =>
            dispatch(updateTemplate(
                template,
                criteria, {
                    ...data,
                    storeId,
                    workingListsType,
                },
            )),
        onDeleteTemplate: (template: any, programId: string, programStageId?: string, callBacks?: Callbacks) =>
            dispatch(deleteTemplate(template, programId, { storeId, workingListsType, programStageId }, callBacks)),
        onSetTemplateSharingSettings: (sharingSettings: SharingSettings, templateId: string) =>
            dispatch(setTemplateSharingSettings(sharingSettings, templateId, storeId)),
    }), [storeId, dispatch, workingListsType, templateState.templates, mainViewConfig]);

    return {
        ...templateState,
        ...templateDispatch,
    };
};

const useView = (
    dispatch: ReduxDispatch,
    categoryCombinationId: string | null | undefined,
    { storeId, workingListsType }: { storeId: string, workingListsType: string }) => {
    const viewState = useSelector(({
        workingLists,
        workingListsUI,
        workingListsMeta,
        workingListsColumnsOrder,
        workingListsStickyFilters,
        workingListsListRecords,
        workingListsContext,
    }: any) => {
        const {
            order: recordsOrder,
        } = workingLists[storeId] || {};

        const {
            isUpdating: updating,
            isLoading: loading,
            dataLoadingError: loadViewError,
        } = workingListsUI[storeId] || {};

        const {
            rowsPerPage,
            currentPage,
            sortById,
            sortByDirection,
            initial,
            nextInitial,
            viewPreloaded,
            next: workingListsMetaNextStore,
        } = workingListsMeta[storeId] || {};

        const {
            rowsPerPage: nextRowsPerPage,
            currentPage: nextCurrentPage,
            sortById: nextSortById,
            sortByDirection: nextSortByDirection,
        } = workingListsMetaNextStore || {};

        return {
            records: workingListsListRecords[storeId],
            recordsOrder,
            updating: !!updating,
            loading: !!loading,
            loadViewError,
            customColumnOrder: workingListsColumnsOrder[storeId],
            programStage: workingListsContext[storeId]?.programStageId,
            stickyFilters: workingListsStickyFilters[storeId],
            rowsPerPage: nextRowsPerPage || rowsPerPage,
            currentPage: nextCurrentPage || currentPage,
            sortById: nextSortById || sortById,
            sortByDirection: nextSortByDirection || sortByDirection,
            initialViewConfig: nextInitial || initial,
            viewPreloaded,
        };
    }, shallowEqual);

    const appliedFilters = useSelector(({ workingListsMeta }: any) =>
        workingListsMeta[storeId] && workingListsMeta[storeId].filters);

    const nextFilters = useSelector(({ workingListsMeta }: any) =>
        workingListsMeta[storeId] && workingListsMeta[storeId].next && workingListsMeta[storeId].next.filters);

    const filtersState = useMemo(() => ({ ...appliedFilters, ...nextFilters }), [
        appliedFilters,
        nextFilters,
    ]);

    const viewDispatch = useMemo((): {
            onLoadView: LoadView;
            onUpdateList: UpdateList;
            onCancelLoadView: CancelLoadView;
            onCancelUpdateList: CancelUpdateList;
            onSortList: Sort;
            onSetListColumnOrder: SetColumnOrder;
            onResetListColumnOrder: ResetColumnOrder;
            onUpdateFilter: UpdateFilter;
            onClearFilter: ClearFilter;
            onRemoveFilter: RemoveFilter;
            onClearFilters: ClearFilters;
            onSelectRestMenuItem: SelectRestMenuItem;
            onChangePage: ChangePage;
            onChangeRowsPerPage: ChangeRowsPerPage;
            onUpdateDefaultTemplate: UpdateDefaultTemplate;} => ({
        onLoadView: (selectedTemplate: any, context: any, meta: any) =>
            dispatch(initListView(
                selectedTemplate,
                context, {
                    ...meta,
                    categoryCombinationId,
                    storeId,
                    workingListsType,
                },
            )),
        onUpdateList: (data: any, meta: any) => {
            const { resetMode, ...queryArgs } = data;
            dispatch(updateList(
                queryArgs, {
                    ...meta,
                    categoryCombinationId,
                    storeId,
                    workingListsType,
                    resetMode,
                },
            ));
        },
        onCancelLoadView: () => dispatch(initListViewCancel(storeId)),
        onCancelUpdateList: () => dispatch(updateListCancel(storeId)),
        onSortList: (sortById: string, sortByDirection: string) => dispatch(sortList(sortById, sortByDirection, storeId)),
        onSetListColumnOrder: (columnOrder: any) => dispatch(setListColumnOrder(columnOrder, storeId)),
        onResetListColumnOrder: () => dispatch(resetListColumnOrder(storeId)),
        onUpdateFilter: (filterId: string, filterValue: any) => dispatch(setFilter(filterId, filterValue, storeId)),
        onRemoveFilter: (filterId: string, filterValue: any) => dispatch(removeFilter(filterId, filterValue, storeId)),
        onClearFilter: (filterId: string) => dispatch(clearFilter(filterId, storeId)),
        onClearFilters: (filterIds: string[]) => dispatch(clearFilters(filterIds, storeId)),
        onSelectRestMenuItem: (id: string) => dispatch(selectRestMenuItem(id, storeId)),
        onChangePage: (pageNumber: number) => dispatch(changePage(pageNumber, storeId)),
        onChangeRowsPerPage: (rowsPerPage: number) => dispatch(changeRowsPerPage(rowsPerPage, storeId)),
        onUpdateDefaultTemplate: defaultTemplate => dispatch(updateDefaultTemplate(defaultTemplate, storeId)),
    }), [storeId, dispatch, categoryCombinationId, workingListsType]);

    return {
        ...viewState,
        filters: filtersState,
        ...viewDispatch,
    };
};

const useWorkingListsContext = (dispatch: ReduxDispatch, { storeId }: { storeId: string }) => {
    const currentContextState = useSelector(({
        currentSelections: { orgUnitId, categories },
        offline: { lastTransaction } }: any) => ({
        orgUnitId,
        categories,
        lastTransaction,
    }), shallowEqual);

    const { listDataRefreshTimestamp, lastTransactionOnListDataRefresh, ...loadedContext } =
        useSelector(({ workingListsContext }: any) => workingListsContext[storeId]) || {};
    const onUnloadingContext = useCallback(() => dispatch(unloadingContext(storeId)), [dispatch, storeId]);

    return {
        ...currentContextState,
        loadedContext,
        onUnloadingContext,
        listDataRefreshTimestamp,
        lastTransactionOnListDataRefresh,
    };
};

export const useWorkingListsCommonStateManagement = (
    storeId: string,
    workingListsType: string,
    program: Program,
    mainViewConfig?: any,
) => {
    const dispatch = useDispatch();
    const context = useWorkingListsContext(dispatch, { storeId });
    const templates = useTemplates(dispatch, { storeId, workingListsType, mainViewConfig });
    const view = useView(
        dispatch,
        program.categoryCombination && program.categoryCombination.id, {
            storeId,
            workingListsType,
        });

    return {
        ...templates,
        ...view,
        ...context,
    };
};
