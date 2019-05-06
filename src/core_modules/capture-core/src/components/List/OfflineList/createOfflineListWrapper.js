// @flow
import React from 'react';
import OfflineList from './OfflineList.component';
import OfflineEmptyList from './OfflineEmptyList.component';

type Props = {
    hasData: boolean,
};


export default (OfflineListContainerCreator: any) => {
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
