import React from 'react';
import { useViewHasTemplateChanges } from '../../WorkingListsCommon';
import { EventWorkingListsDataSourceSetup } from '../DataSourceSetup';
import type { Props } from './currentViewChangesResolver.types';

export const CurrentViewChangesResolver = ({
    filters,
    columns,
    sortById,
    sortByDirection,
    defaultColumns,
    initialViewConfig,
    ...passOnProps
}: Props) => {
    const viewHasChanges = useViewHasTemplateChanges({
        initialViewConfig,
        defaultColumns,
        filters: filters || new Map(),
        columns,
        sortById: sortById || '',
        sortByDirection: sortByDirection || '',
    } as any);

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
