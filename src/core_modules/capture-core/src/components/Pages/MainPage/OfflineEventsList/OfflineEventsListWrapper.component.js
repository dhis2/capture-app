// @flow
import React from 'react';
import OfflineEventsList from './OfflineEventsList.container';
import OfflineEmptyEventsList from './OfflineEmptyEventsList.component';

type Props = {
    hasData: boolean,
};

const OfflineEventsListWrapper = (props: Props) => {
    const hasData = props.hasData;
    if (!hasData) {
        return (
            <OfflineEmptyEventsList />
        );
    }

    return (
        <OfflineEventsList />
    );
};

export default OfflineEventsListWrapper;
