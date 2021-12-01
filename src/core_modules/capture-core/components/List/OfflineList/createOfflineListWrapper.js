// @flow
import React from 'react';
import { OfflineEmptyList } from './OfflineEmptyList.component';
import { OfflineList } from './OfflineList.component';

type Props = {
    hasData: boolean,
};


export const createOfflineListWrapper = (OfflineListContainerCreator: any) => {
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
