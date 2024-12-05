// @flow
/* eslint-disable complexity */
import { useMemo, useCallback } from 'react';
// $FlowFixMe
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
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
    { storeId, workingListsType }: { storeId: string, workingListsType: string }) => {
    const templateState = useSelector(({ workingListsTemplates }) => {
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

    const templateDispatch = useMemo(() => ({
        onSelectTemplate: (templateId, programStageIdArg) => {
            const selectedTemplate = templateState.templates?.find(templete => templete.id === templateId);
            const programStageId = programStageIdArg || selectedTemplate?.criteria?.programStage;
            return dispatch(selectTemplate(templateId, storeId, programStageId));
        },
        onLoadTemplates: (...args) => dispatch(fetchTemplates(...args, storeId, workingListsType)),
        onCancelLoadTemplates: () => dispatch(fetchTemplatesCancel(storeId)),
        onAddTemplate: (name: string, criteria: Object, data: Object, callBacks?: Callbacks) =>
            dispatch(addTemplate(
                name,
                criteria, {
                    ...data,
                    storeId,
                    workingListsType,
                },
                callBacks,
            )),
        onUpdateTemplate: (template: Object, criteria: Object, data: Object) =>
            dispatch(updateTemplate(
                template,
                criteria, {
                    ...data,
                    storeId,
                    workingListsType,
                },
            )),
        onDeleteTemplate: (template: Object, programId: string, programStageId?: string, callBacks?: Callbacks) =>
            dispatch(deleteTemplate(template, programId, { storeId, workingListsType, programStageId }, callBacks)),
        onSetTemplateSharingSettings: (sharingSettings: SharingSettings, templateId: string) => dispatch(setTemplateSharingSettings(sharingSettings, templateId, storeId)),
    }: {|
        onSelectTemplate: SelectTemplate,
        onLoadTemplates: LoadTemplates,
        onCancelLoadTemplates: CancelLoadTemplates,
        onAddTemplate: AddTemplate,
        onUpdateTemplate: UpdateTemplate,
        onDeleteTemplate: DeleteTemplate,
        onSetTemplateSharingSettings: SetTemplateSharingSettings,
    |}), [storeId, dispatch, workingListsType, templateState.templates]);

    return {
        ...templateState,
        ...templateDispatch,
    };
};

const useView = (
    dispatch: ReduxDispatch,
    categoryCombinationId?: ?string,
    { storeId, workingListsType }: { storeId: string, workingListsType: string }) => {
    const viewState = useSelector(({
        workingLists,
        workingListsUI,
        workingListsMeta,
        workingListsColumnsOrder,
        workingListsStickyFilters,
        workingListsListRecords,
        workingListsContext,
    }) => {
        const {
            order: recordsOrder,
        } = workingLists[storeId] || {};

        const {
            isUpdating: updating,
            isLoading: loading,
            isUpdatingWithDialog: updatingWithDialog,
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
            updatingWithDialog: !!updatingWithDialog,
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

    const appliedFilters = useSelector(({ workingListsMeta }) =>
        workingListsMeta[storeId] && workingListsMeta[storeId].filters);

    const nextFilters = useSelector(({ workingListsMeta }) =>
        workingListsMeta[storeId] && workingListsMeta[storeId].next && workingListsMeta[storeId].next.filters);
    const filtersState = useMemo(() => ({ ...appliedFilters, ...nextFilters }), [
        appliedFilters,
        nextFilters,
    ]);

    const viewDispatch = useMemo(() => ({
        onLoadView: (selectedTemplate: Object, context: Object, meta: Object) =>
            dispatch(initListView(
                selectedTemplate,
                context, {
                    ...meta,
                    categoryCombinationId,
                    storeId,
                    workingListsType,
                },
            )),
        onUpdateList: (data: Object, meta: Object) => {
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
        onSortList: (...args) => dispatch(sortList(...args, storeId)),
        onSetListColumnOrder: (...args) => dispatch(setListColumnOrder(...args, storeId)),
        onResetListColumnOrder: () => dispatch(resetListColumnOrder(storeId)),
        onUpdateFilter: (...args) => dispatch(setFilter(...args, storeId)),
        onRemoveFilter: (...args) => dispatch(removeFilter(...args, storeId)),
        onClearFilter: (...args) => dispatch(clearFilter(...args, storeId)),
        onClearFilters: (...args) => dispatch(clearFilters(...args, storeId)),
        onSelectRestMenuItem: (...args) => dispatch(selectRestMenuItem(...args, storeId)),
        onChangePage: (...args) => dispatch(changePage(...args, storeId)),
        onChangeRowsPerPage: (...args) => dispatch(changeRowsPerPage(...args, storeId)),
        onUpdateDefaultTemplate: defaultTemplate => dispatch(updateDefaultTemplate(defaultTemplate, storeId)),
    }: {|
        onLoadView: LoadView,
        onUpdateList: UpdateList,
        onCancelLoadView: CancelLoadView,
        onCancelUpdateList: CancelUpdateList,
        onSortList: Sort,
        onSetListColumnOrder: SetColumnOrder,
        onResetListColumnOrder: ResetColumnOrder,
        onUpdateFilter: UpdateFilter,
        onClearFilter: ClearFilter,
        onRemoveFilter: RemoveFilter,
        onClearFilters: ClearFilters,
        onSelectRestMenuItem: SelectRestMenuItem,
        onChangePage: ChangePage,
        onChangeRowsPerPage: ChangeRowsPerPage,
        onUpdateDefaultTemplate: UpdateDefaultTemplate,
    |}), [storeId, dispatch, categoryCombinationId, workingListsType]);

    return {
        ...viewState,
        filters: filtersState,
        ...viewDispatch,
    };
};

const useWorkingListsContext = (dispatch: ReduxDispatch, { storeId }: { storeId: string }) => {
    const currentContextState = useSelector(({
        currentSelections: { orgUnitId, categories },
        offline: { lastTransaction } }) => ({
        orgUnitId,
        categories,
        lastTransaction,
    }), shallowEqual);

    const { listDataRefreshTimestamp, lastTransactionOnListDataRefresh, ...loadedContext } =
        useSelector(({ workingListsContext }) => workingListsContext[storeId]) || {};
    const onUnloadingContext = useCallback(() => dispatch(unloadingContext(storeId)), [dispatch, storeId]);

    return {
        ...currentContextState,
        loadedContext,
        onUnloadingContext,
        listDataRefreshTimestamp,
        lastTransactionOnListDataRefresh,
    };
};

export const useWorkingListsCommonStateManagement = ((storeId: string, workingListsType: string, program: Program) => {
    const dispatch = useDispatch();
    const context = useWorkingListsContext(dispatch, { storeId, workingListsType });
    const templates = useTemplates(dispatch, { storeId, workingListsType });
    const view = useView(dispatch, program.categoryCombination && program.categoryCombination.id, { storeId, workingListsType });

    return {
        ...templates,
        ...view,
        ...context,
    };
});
