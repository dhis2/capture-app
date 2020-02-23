// @flow
import * as React from 'react';
import { EventList } from '../EventsList';
import { filtersAreEqual } from './utils';

function useUpdateListMemoize(value) {
    const [filters, ...rest] = value;
    const filtersRef = React.useRef(filters);
    const prevFilters = filtersRef.current;

    if (!filtersAreEqual(prevFilters, filters)) {
        filtersRef.current = filters;
    }

    return [filtersRef.current, ...rest];
}

function useUpdateListEffect(callback, dependencies) {
    const firstRun = React.useRef(true);

    React.useEffect(() => {
        if (firstRun.current) {
            firstRun.current = false;
            return undefined;
        }
        return callback();
    }, useUpdateListMemoize(dependencies)); // eslint-disable-line react-hooks/exhaustive-deps
}

type Props = {
    listId: string,
    filters: Object,
    sortById: ?string,
    sortByDirection: ?string,
    currentPage: ?number,
    rowsPerPage: ?number,
    onUpdateEventList: Function,
    onCancelUpdateEventList: Function,
    customMenuContents: Array<Object>,
};

const EventListUpdater = (props: Props) => {
    const {
        listId,
        filters,
        sortById,
        sortByDirection,
        currentPage,
        rowsPerPage,
        onUpdateEventList,
        onCancelUpdateEventList,
        customMenuContents,
    } = props;

    useUpdateListEffect(() => {
        onUpdateEventList(listId, { filters, sortById, sortByDirection, currentPage, rowsPerPage });
        return () => onCancelUpdateEventList(listId);
    }, [
        filters,
        sortById,
        sortByDirection,
        currentPage,
        rowsPerPage,
    ]);

    return (
        <EventList
            listId={listId}
            customMenuContents={customMenuContents}
        />
    );
};

export default EventListUpdater;
