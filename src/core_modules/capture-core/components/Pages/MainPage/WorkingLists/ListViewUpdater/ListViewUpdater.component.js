// @flow
import React from 'react';
import log from 'loglevel';
import { errorCreator } from 'capture-core-utils';
import { ListViewUpdaterContext } from '../workingLists.context';
import { ListViewBuilder } from '../ListViewBuilder';
import { areFiltersEqual } from '../utils';
import type { Props } from './listViewUpdater.types';

function useUpdateListMemoize(value) {
    const [filters, ...rest] = value;
    const filtersRef = React.useRef(filters);
    const prevFilters = filtersRef.current;

    if (!areFiltersEqual(prevFilters, filters)) {
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
    // https://github.com/facebook/create-react-app/issues/6880
    // eslint-disable-next-line
    }, useUpdateListMemoize(dependencies));
}
export const ListViewUpdater = (props: Props) => {
    const {
        filters,
        sortById,
        sortByDirection,
        onUpdateList,
        customMenuContents,
        programId,
        orgUnitId,
        categories,
        ...passOnProps
    } = props;

    const {
        currentPage,
        rowsPerPage,
        onCancelUpdateList,
        lastIdDeleted,
    } = React.useContext(ListViewUpdaterContext);

    if (!currentPage || !rowsPerPage) {
        log.error(
            errorCreator('currentPage and rowsPerPage needs to be set during list view loading')(
                { currentPage, rowsPerPage }));
        throw Error('currentPage and rowsPerPage needs to be set during list view loading. See console for details');
    }

    useUpdateListEffect(() => {
        onUpdateList({
            filters,
            sortById,
            sortByDirection,
            currentPage,
            rowsPerPage,
            programId,
            orgUnitId,
            categories,
            lastIdDeleted,
        });
        return () => onCancelUpdateList && onCancelUpdateList();
    }, [
        filters,
        sortById,
        sortByDirection,
        currentPage,
        rowsPerPage,
        programId,
        orgUnitId,
        categories,
        lastIdDeleted,
    ]);

    return (
        <ListViewBuilder
            {...passOnProps}
            filters={filters}
            sortById={sortById}
            sortByDirection={sortByDirection}
            currentPage={currentPage}
            rowsPerPage={rowsPerPage}
            customMenuContents={customMenuContents}
        />
    );
};
