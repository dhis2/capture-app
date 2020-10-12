// @flow
import * as React from 'react';
import { ListViewUpdaterContext } from './workingLists.context';
import { ListViewBuilder } from './ListViewBuilder.component';
import { areFiltersEqual } from './utils';

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

type PassOnProps = {
    getMainColumnMetadataHeader: any,
    getOrdinaryColumnMetadata: any,
};

type Props = {
    ...PassOnProps,
    filters: Object,
    sortById: ?string,
    sortByDirection: ?string,
    onUpdateList: Function,
    customMenuContents: Array<Object>,
    programId: string,
    orgUnitId: string,
    categories?: Object,
};

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
