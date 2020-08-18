// @flow
import * as React from 'react';
import uuid from 'uuid/v4';
import { ListViewConfigContext } from './workingLists.context';
import { ListViewConfigMenuContent } from './ListViewConfigMenuContent.component';
import { filtersAreEqual } from './utils';
import type {
    ColumnConfig,
} from './workingLists.types';

const determinePrimitiveConfigValue = (value, nextValue) => (nextValue !== undefined ? nextValue : value);
const isCurrentListModified = (
    filters: Object,
    sortById: string,
    sortByDirection: string,
    columnOrder: Array<ColumnConfig>,
    initialMeta: Object,
) => {
    const {
        filters: initialFilters,
        sortById: initialSortById,
        sortByDirection: initialSortByDirection,
        columnDisplayOrder: initialColumns,
    } = initialMeta;

    if (sortById !== initialSortById || sortByDirection !== initialSortByDirection) {
        return true;
    }

    const columns = columnOrder
        .filter(c => c.visible)
        .map(c => c.id);

    if (columns.length !== initialColumns.length) {
        return true;
    }

    if (columns.some((c, index) => c !== initialColumns[index])) {
        return true;
    }

    return !filtersAreEqual(initialFilters, filters);
};


type PassOnProps = {
    listId: string,
    defaultConfig: Map<string, Object>,
    currentTemplate: Object,
};

type Props = {
    ...PassOnProps,
    programId: string,
    children: (currentListIsModified: boolean) => React.Node,
};

export const ListViewConfig = (props: Props) => {
    const { children, programId, ...passOnProps } = props;
    const {
        listMeta,
        columnOrder,
        onAddTemplate,
        onUpdateTemplate,
        onDeleteTemplate,
        convertToEventFilterQueryCriteria,
    } = React.useContext(ListViewConfigContext);
    const {
        next: nextMeta = {},
        initial: initialMeta,
        nextInitial: nextInitialMeta,
        ...mainMeta
    } = listMeta || {};

    const {
        filters,
        sortById,
        sortByDirection,
        currentPage,
        rowsPerPage,
    } = mainMeta;

    const {
        filters: nextFilters,
        sortById: nextSortById,
        sortByDirection: nextSortByDirection,
        currentPage: nextCurrentPage,
        rowsPerPage: nextRowsPerPage,
    } = nextMeta;

    const calcFilters = React.useMemo(() => {
        const concatenatedFilters = {
            ...filters,
            ...nextFilters,
        };
        return concatenatedFilters;
    }, [
        filters,
        nextFilters,
    ]);

    const calcSortById = determinePrimitiveConfigValue(sortById, nextSortById);
    const calcSortByDirection = determinePrimitiveConfigValue(sortByDirection, nextSortByDirection);
    const calcPage = determinePrimitiveConfigValue(currentPage, nextCurrentPage);
    const calcRowsPerPage = determinePrimitiveConfigValue(rowsPerPage, nextRowsPerPage);

    const calcInitialMeta = nextInitialMeta || initialMeta;
    const currentListIsModified = calcInitialMeta ? isCurrentListModified(
        calcFilters,
        calcSortById,
        calcSortByDirection,
        columnOrder,
        calcInitialMeta,
    ) : false;

    const updateTemplateHandler = React.useCallback((template, listConfig) => {
        const templateQueryCriteria =
        convertToEventFilterQueryCriteria(listConfig);

        onUpdateTemplate(template, templateQueryCriteria, {
            ...listConfig,
            programId,
        });
    }, [onUpdateTemplate, programId, convertToEventFilterQueryCriteria]);

    const addTemplateHandler = React.useCallback((name, listConfig) => {
        const templateQueryCriteria =
        convertToEventFilterQueryCriteria(listConfig);
        onAddTemplate(name, templateQueryCriteria, {
            ...listConfig,
            template: listConfig.currentTemplate,
            clientId: uuid(),
            programId,
        });
    }, [onAddTemplate, programId, convertToEventFilterQueryCriteria]);

    const deleteTemplateHandler = React.useCallback((template, listId) =>
        onDeleteTemplate(template, programId, listId), [onDeleteTemplate, programId]);

    return (
        <React.Fragment>
            {children(currentListIsModified)}
            <ListViewConfigMenuContent
                {...passOnProps}
                programId={programId}
                filters={calcFilters}
                sortById={calcSortById}
                sortByDirection={calcSortByDirection}
                columnOrder={columnOrder}
                currentPage={calcPage}
                rowsPerPage={calcRowsPerPage}
                onUpdateTemplate={updateTemplateHandler}
                onAddTemplate={addTemplateHandler}
                onDeleteTemplate={deleteTemplateHandler}
                currentListIsModified={currentListIsModified}
            />
        </React.Fragment>
    );
};
