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
    cleanSkipInitAddingTemplate,
    unloadingContext,
    sortList,
    setListColumnOrder,
    setFilter,
    clearFilter,
    restMenuItemSelected,
    changePage,
    changeRowsPerPage,
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
    Sort,
    UpdateFilter,
    UpdateList,
} from '../../WorkingLists';
import type { AddTemplate, DeleteTemplate, UpdateTemplate } from '../../WorkingListsCommon';

const useTemplates = (
    dispatch: ReduxDispatch,
    { storeId, workingListsType }: { storeId: string, workingListsType: string }) => {
    const templateState = useSelector(({ workingListsTemplates }) => ({
        currentTemplate: workingListsTemplates[storeId] &&
            workingListsTemplates[storeId].selectedTemplateId &&
            workingListsTemplates[storeId].templates &&
            workingListsTemplates[storeId].templates.find(template => template.id === workingListsTemplates[storeId].selectedTemplateId),
        templates: workingListsTemplates[storeId] &&
            workingListsTemplates[storeId].templates,
        templatesLoading: !!workingListsTemplates[storeId] &&
            !!workingListsTemplates[storeId].loading,
        loadTemplatesError: workingListsTemplates[storeId] && workingListsTemplates[storeId].loadError,
    }), shallowEqual);

    const templateDispatch = useMemo(() => ({
        onSelectTemplate: (...args) => dispatch(selectTemplate(...args, storeId)),
        onLoadTemplates: (...args) => dispatch(fetchTemplates(...args, storeId, workingListsType)),
        onCancelLoadTemplates: (...args) => dispatch(fetchTemplatesCancel(...args, storeId)),
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
        onCleanSkipInitAddingTemplate: (...args) => dispatch(cleanSkipInitAddingTemplate(...args, storeId)),
    }: {|
        onSelectTemplate: SelectTemplate,
        onLoadTemplates: LoadTemplates,
        onCancelLoadTemplates: CancelLoadTemplates,
        onAddTemplate: AddTemplate,
        onUpdateTemplate: UpdateTemplate,
        onDeleteTemplate: DeleteTemplate,
        onCleanSkipInitAddingTemplate: Function,
    |}), [storeId, dispatch, workingListsType]);

    return {
        ...templateState,
        ...templateDispatch,
    };
};

const useView = (
    dispatch: ReduxDispatch,
    categoryCombinationMeta: Object,
    { storeId, workingListsType }: { storeId: string, workingListsType: string }) => {
    const viewState = useSelector(({ workingLists, workingListsUI, workingListsMeta, workingListsColumnsOrder, workingListsStickyFilters }) => ({
        recordsOrder: workingLists[storeId] && workingLists[storeId].order,
        updating: !!workingListsUI[storeId] && !!workingListsUI[storeId].isUpdating,
        loading: !!workingListsUI[storeId] && !!workingListsUI[storeId].isLoading,
        updatingWithDialog: !!workingListsUI[storeId] && !!workingListsUI[storeId].isUpdatingWithDialog,
        loadViewError: workingListsUI[storeId] && workingListsUI[storeId].dataLoadingError,
        customColumnOrder: workingListsColumnsOrder[storeId],
        stickyFilters: workingListsStickyFilters[storeId],
        rowsPerPage: (workingListsMeta[storeId] && workingListsMeta[storeId].next && workingListsMeta[storeId].next.rowsPerPage) || (workingListsMeta[storeId] && workingListsMeta[storeId].rowsPerPage),
        currentPage: (workingListsMeta[storeId] && workingListsMeta[storeId].next && workingListsMeta[storeId].next.currentPage) || (workingListsMeta[storeId] && workingListsMeta[storeId].currentPage),
        rowsCount: workingListsMeta[storeId] && workingListsMeta[storeId].rowsCount,
        sortById: (workingListsMeta[storeId] && workingListsMeta[storeId].next && workingListsMeta[storeId].next.sortById) || (workingListsMeta[storeId] && workingListsMeta[storeId].sortById),
        sortByDirection: (workingListsMeta[storeId] && workingListsMeta[storeId].next && workingListsMeta[storeId].next.sortByDirection) || (workingListsMeta[storeId] && workingListsMeta[storeId].sortByDirection),
        initialViewConfig: (workingListsMeta[storeId] && workingListsMeta[storeId].nextInitial) || (workingListsMeta[storeId] && workingListsMeta[storeId].initial),
    }), shallowEqual);

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
                    categoryCombinationMeta,
                    storeId,
                    workingListsType,
                },
            )),
        onUpdateList: (queryArgs: Object, columnsMetaForDataFetching: Object) =>
            dispatch(updateList(
                queryArgs, {
                    columnsMetaForDataFetching,
                    categoryCombinationMeta,
                    storeId,
                    workingListsType,
                },
            )),
        onCancelLoadView: (...args) => dispatch(initListViewCancel(...args, storeId)),
        onCancelUpdateList: (...args) => dispatch(updateListCancel(...args, storeId)),
        onSortList: (...args) => dispatch(sortList(...args, storeId)),
        onSetListColumnOrder: (...args) => dispatch(setListColumnOrder(...args, storeId)),
        onUpdateFilter: (...args) => dispatch(setFilter(...args, storeId)),
        onClearFilter: (...args) => dispatch(clearFilter(...args, storeId)),
        onSelectRestMenuItem: (...args) => dispatch(restMenuItemSelected(...args, storeId)),
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
    |}), [storeId, dispatch, categoryCombinationMeta, workingListsType]);

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

    const loadedContext = useSelector(({ workingListsContext }) => workingListsContext[storeId]);
    const onUnloadingContext = useCallback(() => dispatch(unloadingContext(storeId)), [dispatch, storeId]);

    return {
        ...currentContextState,
        loadedContext,
        onUnloadingContext,
    };
};

export const useWorkingListsCommonStateManagement = ((storeId: string, workingListsType: string, program: Program) => {
    const dispatch = useDispatch();
    const context = useWorkingListsContext(dispatch, { storeId, workingListsType });
    const templates = useTemplates(dispatch, { storeId, workingListsType });
    const view = useView(dispatch, program.categoryCombination, { storeId, workingListsType });

    return {
        ...templates,
        ...view,
        ...context,
    };
});
