// @flow
import * as React from 'react';
import uuid from 'uuid/v4';
import { EventListConfigContext } from './workingLists.context';
import EventListConfigMenuContent from './EventListConfigMenuContent.component';
import { convertToEventQueryCriteria } from './epics/eventFiltersInterface';
import { filtersAreEqual } from './utils';
import type {
    ApiEventQueryCriteria,
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
    eventsData: ?Object,
    currentTemplate: Object,
    onDeleteTemplate: Function,
};

type Props = {
    ...PassOnProps,
    children: (currentListIsModified: boolean) => React.Node,
};

const EventListConfig = (props: Props) => {
    const { children, ...passOnProps } = props;
    const {
        listMeta,
        columnOrder,
        onAddTemplate,
        onUpdateTemplate,
    } = React.useContext(EventListConfigContext);
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
        const eventQueryCriteria: ApiEventQueryCriteria =
            convertToEventQueryCriteria(listConfig);

        onUpdateTemplate(template, eventQueryCriteria, listConfig);
    }, [onUpdateTemplate]);

    const addTemplateHandler = React.useCallback((name, listConfig) => {
        const eventQueryCriteria: ApiEventQueryCriteria =
            convertToEventQueryCriteria(listConfig);
        onAddTemplate(name, eventQueryCriteria, {
            ...listConfig,
            template: listConfig.currentTemplate,
            clientId: uuid(),
        });
    }, [onAddTemplate]);

    return (
        <React.Fragment>
            {children(currentListIsModified)}
            <EventListConfigMenuContent
                {...passOnProps}
                filters={calcFilters}
                sortById={calcSortById}
                sortByDirection={calcSortByDirection}
                columnOrder={columnOrder}
                currentPage={calcPage}
                rowsPerPage={calcRowsPerPage}
                onUpdateTemplate={updateTemplateHandler}
                onAddTemplate={addTemplateHandler}
                currentListIsModified={currentListIsModified}
            />
        </React.Fragment>
    );
};

export default EventListConfig;
