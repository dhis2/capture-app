import React from 'react';
import { OfflineList } from './OfflineList.component';
import { OfflineEmptyList } from './OfflineEmptyList.component';
import { DataSource } from '../types';
import { Column } from '../OnlineList';

type Props = {
    hasData: boolean;
    dataSource: DataSource | void;
    columns: Array<Column> | null;
    rowIdKey: string;
    noItemsText?: string;
};

export const createOfflineListWrapper = (OfflineListContainerCreator?: any) => {
    const OfflineListContainer = OfflineListContainerCreator ?
        OfflineListContainerCreator(OfflineList) :
        OfflineList;

    const OfflineListWrapper = (props: Props) => {
        const { hasData, ...passOnProps } = props;
        if (!hasData) {
            return (
                <OfflineEmptyList />
            );
        }

        return (
            <OfflineListContainer
                {...passOnProps}
            />
        );
    };
    return OfflineListWrapper;
};
