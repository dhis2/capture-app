// @flow
/* eslint-disable complexity */
import { useMemo, useCallback } from 'react';
// $FlowFixMe
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import {
    sortList,
    setListColumnOrder,
    setFilter,
    clearFilter,
    restMenuItemSelected,
    changePage,
    changeRowsPerPage,
} from '../actions';

import {
    selectTemplate,
    addTemplate,
    updateTemplate,
    deleteTemplate,
    fetchTemplates,
    fetchTemplatesCancel,
    initEventList,
    initEventListCancel,
    updateEventList,
    updateEventListCancel,
    cleanSkipInitAddingTemplate,
    unloadingContext,
} from '../../EventWorkingLists/eventWorkingLists.actions'; // TODO: Move these actions
import { getProgramFromProgramIdThrowIfNotFound } from '../../../../../metaData';

const useTemplates = (listId: string, workingListDispatch: Function) => {
    const templateState = useSelector(({ workingListsTemplates }) => ({
        currentTemplate: workingListsTemplates[listId] &&
            workingListsTemplates[listId].selectedTemplateId &&
            workingListsTemplates[listId].templates &&
            workingListsTemplates[listId].templates.find(template => template.id === workingListsTemplates[listId].selectedTemplateId),
        templates: workingListsTemplates[listId] &&
            workingListsTemplates[listId].templates,
        templatesForProgramId: workingListsTemplates[listId] &&
            workingListsTemplates[listId].programId,
        templatesAreLoading: !!workingListsTemplates[listId] &&
            !!workingListsTemplates[listId].loading,
        loadTemplatesError: workingListsTemplates[listId] && workingListsTemplates[listId].loadError,
    }), shallowEqual);

    const templateDispatch = useMemo(() => ({
        onSelectTemplate: workingListDispatch(selectTemplate),
        onLoadTemplates: workingListDispatch(fetchTemplates),
        onCancelLoadTemplates: workingListDispatch(fetchTemplatesCancel),
        onAddTemplate: workingListDispatch(addTemplate, (name: string, eventQueryCriteria: Object, data: Object) => [
            name,
            eventQueryCriteria, {
                ...data,
                listId,
            },
        ]),
        onUpdateTemplate: workingListDispatch(updateTemplate, (template: Object, eventQueryCriteria: Object, data: Object) => [
            template,
            eventQueryCriteria, {
                ...data,
                listId,
            },
        ]),
        onDeleteTemplate: workingListDispatch(deleteTemplate),
        onCleanSkipInitAddingTemplate: workingListDispatch(cleanSkipInitAddingTemplate),
    }), [listId, workingListDispatch]);

    return {
        ...templateState,
        ...templateDispatch,
    };
};

const useView = (listId: string, workingListDispatch: Function, categoryCombinationMeta: Object) => {
    const listState = useSelector(({ workingLists, workingListsUI, workingListsMeta, workingListsColumnsOrder, workingListsStickyFilters }) => ({
        recordsOrder: workingLists[listId] && workingLists[listId].order,
        isUpdating: !!workingListsUI[listId] && !!workingListsUI[listId].isUpdating,
        isLoading: !!workingListsUI[listId] && !!workingListsUI[listId].isLoading,
        isUpdatingWithDialog: !!workingListsUI[listId] && !!workingListsUI[listId].isUpdatingWithDialog,
        loadEventListError: workingListsUI[listId] && workingListsUI[listId].dataLoadingError,
        customColumnOrder: workingListsColumnsOrder[listId],
        stickyFilters: workingListsStickyFilters[listId],
        rowsPerPage: (workingListsMeta[listId] && workingListsMeta[listId].next && workingListsMeta[listId].next.rowsPerPage) || (workingListsMeta[listId] && workingListsMeta[listId].rowsPerPage),
        currentPage: (workingListsMeta[listId] && workingListsMeta[listId].next && workingListsMeta[listId].next.currentPage) || (workingListsMeta[listId] && workingListsMeta[listId].currentPage),
        rowsCount: workingListsMeta[listId] && workingListsMeta[listId].rowsCount,
        sortById: (workingListsMeta[listId] && workingListsMeta[listId].next && workingListsMeta[listId].next.sortById) || (workingListsMeta[listId] && workingListsMeta[listId].sortById),
        sortByDirection: (workingListsMeta[listId] && workingListsMeta[listId].next && workingListsMeta[listId].next.sortByDirection) || (workingListsMeta[listId] && workingListsMeta[listId].sortByDirection),
        initialViewConfig: (workingListsMeta[listId] && workingListsMeta[listId].nextInitial) || (workingListsMeta[listId] && workingListsMeta[listId].initial),
    }), shallowEqual);

    const appliedFilters = useSelector(({ workingListsMeta }) =>
        workingListsMeta[listId] && workingListsMeta[listId].filters);

    const nextFilters = useSelector(({ workingListsMeta }) =>
        workingListsMeta[listId] && workingListsMeta[listId].next && workingListsMeta[listId].next.filters);
    const filtersState = useMemo(() => ({ ...appliedFilters, ...nextFilters }), [
        appliedFilters,
        nextFilters,
    ]);

    const listDispatch = useMemo(() => ({
        onLoadEventList: workingListDispatch(initEventList,
            (selectedTemplate: Object, context: Object, meta: Object) => [
                selectedTemplate,
                context, {
                    ...meta,
                    categoryCombinationMeta,
                    listId,
                },
            ]),
        onUpdateEventList: workingListDispatch(updateEventList,
            (queryArgs: Object, columnsMetaForDataFetching: Object) => [
                queryArgs, {
                    columnsMetaForDataFetching,
                    categoryCombinationMeta,
                    listId,
                },
            ]),
        onCancelLoadEventList: workingListDispatch(initEventListCancel),
        onCancelUpdateEventList: workingListDispatch(updateEventListCancel),
        onSortList: workingListDispatch(sortList),
        onSetListColumnOrder: workingListDispatch(setListColumnOrder),
        onFilterUpdate: workingListDispatch(setFilter),
        onClearFilter: workingListDispatch(clearFilter),
        onRestMenuItemSelected: workingListDispatch(restMenuItemSelected),
        onChangePage: workingListDispatch(changePage),
        onChangeRowsPerPage: workingListDispatch(changeRowsPerPage),
    }), [listId, workingListDispatch, categoryCombinationMeta]);

    return {
        ...listState,
        filters: filtersState,
        ...listDispatch,
    };
};

const useWorkingListsContext = (listId: string, workingListDispatch: Function) => {
    const currentContextState = useSelector(({
        currentSelections: { orgUnitId, categories },
        offline: { lastTransaction } }) => ({
        orgUnitId,
        categories,
        lastTransaction,
    }), shallowEqual);

    const listContext = useSelector(({ workingListsContext }) => workingListsContext[listId]);

    const onUnloadingContext = useCallback(() => workingListDispatch(unloadingContext), [workingListDispatch]);

    const programId = useSelector(({ currentSelections }) => currentSelections.programId);
    const program = useMemo(() => getProgramFromProgramIdThrowIfNotFound(programId),
        [programId]);

    return {
        ...currentContextState,
        listContext,
        onUnloadingContext,
        program,
    };
};

export const useWorkingListsCommonStateManagement = ((listId: string) => {
    const dispatch = useDispatch();
    const workingListDispatch = useCallback(
        (actionCreator, argsCreator) =>
            (...args) =>
                (argsCreator ?
                    dispatch(actionCreator(...argsCreator(...args))) :
                    dispatch(actionCreator(...args, listId))), [dispatch, listId]);

    const context = useWorkingListsContext(listId, workingListDispatch);
    const templates = useTemplates(listId, workingListDispatch);
    const view = useView(listId, workingListDispatch, context.program.categoryCombination);

    return {
        ...templates,
        ...view,
        ...context,
    };
});
