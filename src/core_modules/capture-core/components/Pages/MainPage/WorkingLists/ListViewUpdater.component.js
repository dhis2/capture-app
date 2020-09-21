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
    onUpdateEventList: Function,
    onCancelUpdateEventList: Function,
    customMenuContents: Array<Object>,
    lastEventIdDeleted: ?string,
    programId: string,
    orgUnitId: string,
    categories?: Object,
};

export const ListViewUpdater = (props: Props) => {
    const {
        filters,
        sortById,
        sortByDirection,
        onUpdateEventList,
        onCancelUpdateEventList,
        customMenuContents,
        lastEventIdDeleted,
        programId,
        orgUnitId,
        categories,
        ...passOnProps
    } = props;

    const {
        currentPage,
        rowsPerPage,
    } = React.useContext(ListViewUpdaterContext);

    useUpdateListEffect(() => {
        onUpdateEventList({
            filters,
            sortById,
            sortByDirection,
            currentPage,
            rowsPerPage,
            programId,
            orgUnitId,
            categories,
            lastEventIdDeleted,
        });
        return () => onCancelUpdateEventList();
    }, [
        filters,
        sortById,
        sortByDirection,
        currentPage,
        rowsPerPage,
        programId,
        orgUnitId,
        categories,
        lastEventIdDeleted,
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
