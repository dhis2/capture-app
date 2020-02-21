// @flow
import * as React from 'react';
import { EventListConfigContext } from './workingLists.context';
import EventListLoader from './EventListLoader.component';

const determinePrimitiveConfigValue = (value, nextValue) => (nextValue !== undefined ? nextValue : value);

type PassOnProps = {
    listId: string,
    currentTemplate: Object,
    defaultConfig: Map<string, Object>,
    eventsData: ?Object,
};

type Props = {
    ...PassOnProps,
};

const EventListConfig = (props: Props) => {
    const { ...passOnProps } = props;
    const {
        listMeta,
    } = React.useContext(EventListConfigContext);
    const { next: nextMeta = {}, ...mainMeta } = listMeta || {};

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


    return (
        <EventListLoader
            {...passOnProps}
            filters={calcFilters}
            sortById={calcSortById}
            sortByDirection={calcSortByDirection}
            currentPage={calcPage}
            rowsPerPage={calcRowsPerPage}
        />
    );
};

export default EventListConfig;
