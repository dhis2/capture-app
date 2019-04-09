// @flow
import React from 'react';
import OfflineEventsList from '../OfflineEventsList/OfflineEventsList.container';
import WorkingListConfigSelector from '../EventsList/WorkingListConfigSelector/WorkingListConfigSelector.container';
import withListHeaderWrapper from '../ListHeaderWrapper/withListHeaderWrapper';
import withEventsListHeader from '../EventsList/Header/withHeader';

type Props = {
    isOnline: boolean,
};

const OnlineEventsListWithHeader = withEventsListHeader()(withListHeaderWrapper()(WorkingListConfigSelector));

const EventsListConnectivityWrapper = (props: Props) => (
    <div>
        {
            (() => {
                if (!props.isOnline) {
                    return (
                        <OfflineEventsList />
                    );
                }
                return (
                    <OnlineEventsListWithHeader />
                );
            })()
        }
    </div>
);

export default EventsListConnectivityWrapper;
