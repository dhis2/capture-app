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
    setFilter,
    clearFilter,
    selectRestMenuItem,
    changePage,
    changeRowsPerPage,
    setTemplateSharingSettings,
} from '../actions';
import type { Program } from '../../../../../metaData';
import type {
    CancelLoadTemplates,
    CancelLoadView,
    CancelUpdateList,
    ChangePage,
    ChangeRowsPerPage,
    ClearFilter,
    LoadTemplates,
    LoadView,
    SelectRestMenuItem,
    SelectTemplate,
    SetColumnOrder,
    SetTemplateSharingSettings,
    SharingSettings,
    Sort,
    UpdateFilter,
} from '../../WorkingLists';
import type { AddTemplate, DeleteTemplate, UpdateTemplate, UpdateList } from '../../WorkingListsCommon';

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
        onSelectTemplate: (...args) => dispatch(selectTemplate(...args, storeId)),
        onLoadTemplates: (...args) => dispatch(fetchTemplates(...args, storeId, workingListsType)),
        onCancelLoadTemplates: () => dispatch(fetchTemplatesCancel(storeId)),
        onAddTemplate: (name: string, criteria: Object, data: Object) =>
            dispatch(addTemplate(
                name,
                criteria, {
                    ...data,
                    storeId,
                    workingListsType,
                },
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
        onDeleteTemplate: (...args) => dispatch(deleteTemplate(...args, { storeId, workingListsType })),
        onSetTemplateSharingSettings: (sharingSettings: SharingSettings, templateId: string) => dispatch(setTemplateSharingSettings(sharingSettings, templateId, storeId)),
    }: {|
        onSelectTemplate: SelectTemplate,
        onLoadTemplates: LoadTemplates,
        onCancelLoadTemplates: CancelLoadTemplates,
        onAddTemplate: AddTemplate,
        onUpdateTemplate: UpdateTemplate,
        onDeleteTemplate: DeleteTemplate,
        onSetTemplateSharingSettings: SetTemplateSharingSettings,
    |}), [storeId, dispatch, workingListsType]);

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
        onUpdateList: (queryArgs: Object, meta: Object) =>
            dispatch(updateList(
                queryArgs, {
                    ...meta,
                    categoryCombinationId,
                    storeId,
                    workingListsType,
                },
            )),
        onCancelLoadView: () => dispatch(initListViewCancel(storeId)),
        onCancelUpdateList: () => dispatch(updateListCancel(storeId)),
        onSortList: (...args) => dispatch(sortList(...args, storeId)),
        onSetListColumnOrder: (...args) => dispatch(setListColumnOrder(...args, storeId)),
        onUpdateFilter: (...args) => dispatch(setFilter(...args, storeId)),
        onClearFilter: (...args) => dispatch(clearFilter(...args, storeId)),
        onSelectRestMenuItem: (...args) => dispatch(selectRestMenuItem(...args, storeId)),
        onChangePage: (...args) => dispatch(changePage(...args, storeId)),
        onChangeRowsPerPage: (...args) => dispatch(changeRowsPerPage(...args, storeId)),
    }: {|
        onLoadView: LoadView,
        onUpdateList: UpdateList,
        onCancelLoadView: CancelLoadView,
        onCancelUpdateList: CancelUpdateList,
        onSortList: Sort,
        onSetListColumnOrder: SetColumnOrder,
        onUpdateFilter: UpdateFilter,
        onClearFilter: ClearFilter,
        onSelectRestMenuItem: SelectRestMenuItem,
        onChangePage: ChangePage,
        onChangeRowsPerPage: ChangeRowsPerPage,
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
