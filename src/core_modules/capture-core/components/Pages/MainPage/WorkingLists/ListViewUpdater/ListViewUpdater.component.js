// @flow
import React, { useEffect, useRef, useContext } from 'react';
import log from 'loglevel';
import { errorCreator } from 'capture-core-utils';
import { ListViewUpdaterContext } from '../workingLists.context';
import { ListViewBuilder } from '../ListViewBuilder';
import { areFiltersEqual } from '../utils';
import type { Props } from './listViewUpdater.types';

const useUpdateListMemoize = (value) => {
    const [filters, ...rest] = value;
    const filtersRef = useRef(filters);
    const prevFilters = filtersRef.current;

    if (!areFiltersEqual(prevFilters, filters)) {
        filtersRef.current = filters;
    }

    return [filtersRef.current, ...rest];
};

const useUpdateEffect = (callback, { forceFirstRunUpdate, filters, restDependencies }) => {
    const firstRun = useRef(true);

    useEffect(() => {
        if (firstRun.current) {
            firstRun.current = false;
            if (!forceFirstRunUpdate) {
                return undefined;
            }
        }
        return callback();
    // https://github.com/facebook/create-react-app/issues/6880
    // eslint-disable-next-line
    }, useUpdateListMemoize([filters, forceFirstRunUpdate, ...restDependencies]));
};
// eslint-disable-next-line complexity
export const ListViewUpdater = (props: Props) => {
    const {
        filters,
        sortById,
        sortByDirection,
        onUpdateList,
        programId,
        orgUnitId,
        categories,
        viewLoadedOnFirstRun,
        ...passOnProps
    } = props;

    const context = useContext(ListViewUpdaterContext);
    if (!context) {
        throw Error('missing ListViewUpdaterContext');
    }

    const {
        currentPage,
        rowsPerPage,
        onCancelUpdateList,
        customUpdateTrigger,
        forceUpdateOnMount,
        dirtyList,
    } = context;

    const forceFirstRunUpdateRef = useRef((forceUpdateOnMount || dirtyList) && !viewLoadedOnFirstRun);

    if (!currentPage || !rowsPerPage) {
        log.error(
            errorCreator('currentPage and rowsPerPage needs to be set during list view loading')(
                { currentPage, rowsPerPage }));
        throw Error('currentPage and rowsPerPage needs to be set during list view loading. See console for details');
    }

    useUpdateEffect(() => {
        onUpdateList({
            filters,
            sortById,
            sortByDirection,
            currentPage,
            rowsPerPage,
            programId,
            orgUnitId,
            categories,
        });
        return () => onCancelUpdateList && onCancelUpdateList();
    }, {
        forceFirstRunUpdate: forceFirstRunUpdateRef.current,
        filters,
        restDependencies: [
            sortById,
            sortByDirection,
            currentPage,
            rowsPerPage,
            programId,
            orgUnitId,
            categories,
            customUpdateTrigger,
            onUpdateList,
            onCancelUpdateList,
        ],
    });

    useEffect(() => () => onCancelUpdateList && onCancelUpdateList(), [onCancelUpdateList]);

    return (
        <ListViewBuilder
            {...passOnProps}
            filters={filters}
            sortById={sortById}
            sortByDirection={sortByDirection}
            currentPage={currentPage}
            rowsPerPage={rowsPerPage}
        />
    );
};
