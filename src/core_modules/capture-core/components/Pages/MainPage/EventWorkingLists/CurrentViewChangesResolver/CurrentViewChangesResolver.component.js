// @flow
import React, { useMemo } from 'react';
import { areFiltersEqual } from '../../WorkingLists';
import { EventWorkingListsDataSourceSetup } from '../DataSourceSetup';
import type { Props, CurrentViewConfig, InitialViewConfig } from './currentViewChangesResolver.types';

const isCurrentViewModified = ({
    filters,
    columns,
    sortById,
    sortByDirection,
}: CurrentViewConfig, {
    filters: initialFilters,
    visibleColumnIds: initialVisibleColumnIds,
    sortById: initialSortById,
    sortByDirection: initialSortByDirection,
}: InitialViewConfig,
) => {
    if (sortById !== initialSortById || sortByDirection !== initialSortByDirection) {
        return true;
    }

    const visibleColumnIds = columns
        .filter(c => c.visible)
        .map(c => c.id);

    if (visibleColumnIds.length !== initialVisibleColumnIds.length) {
        return true;
    }

    if (visibleColumnIds.some((columnId, index) => columnId !== initialVisibleColumnIds[index])) {
        return true;
    }

    return !areFiltersEqual(initialFilters, filters);
};

export const CurrentViewChangesResolver = ({
    filters,
    columns,
    sortById,
    sortByDirection,
    defaultColumns,
    initialViewConfig,
    ...passOnProps
}: Props) => {
    const calculatedInitialViewConfig = useMemo(() => {
        if (!initialViewConfig) {
            return initialViewConfig;
        }

        const visibleColumnIds = initialViewConfig.visibleCustomColumnIds || defaultColumns
            .filter(defaultColumn => defaultColumn.visible)
            .map(defaultColumn => defaultColumn.id);

        return {
            ...initialViewConfig,
            visibleCustomColumnIds: undefined,
            visibleColumnIds,
        };
    }, [initialViewConfig, defaultColumns]);

    const viewHasChanges = useMemo(() => {
        if (!calculatedInitialViewConfig) {
            return undefined;
        }

        // $FlowFixMe State logic
        return isCurrentViewModified({ filters, columns, sortById, sortByDirection }, calculatedInitialViewConfig);
    }, [
        filters,
        columns,
        sortById,
        sortByDirection,
        calculatedInitialViewConfig,
    ]);

    return (
        <EventWorkingListsDataSourceSetup
            {...passOnProps}
            filters={filters}
            columns={columns}
            sortById={sortById}
            sortByDirection={sortByDirection}
            currentViewHasTemplateChanges={viewHasChanges}
        />
    );
};
