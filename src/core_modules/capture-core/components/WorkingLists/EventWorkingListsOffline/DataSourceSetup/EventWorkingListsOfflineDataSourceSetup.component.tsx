import React from 'react';
import { useDataSource } from '../../WorkingListsCommon';
import { createOfflineListWrapper } from '../../../List'; // TODO: Refactor list
import type { Props } from './eventWorkingListsOfflineDataSourceSetup.types';

const OfflineListWrapper = createOfflineListWrapper() as React.ComponentType<{
    hasData: boolean;
    dataSource?: any;
    columns: any;
    rowIdKey: string;
    noItemsText?: string;
    [key: string]: any;
}>;

export const EventWorkingListsOfflineDataSourceSetup = ({
    eventRecords,
    columns,
    recordsOrder,
    ...passOnProps
}: Props) => {
    const hasData = !!recordsOrder;

    return (
        <OfflineListWrapper
            {...passOnProps}
            hasData={hasData}
            dataSource={useDataSource(eventRecords, recordsOrder, columns)}
            columns={columns}
            rowIdKey="id"
        />
    );
};
