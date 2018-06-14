// @flow
import React from 'react';
import OfflineEventsListWrapper from '../OfflineEventsList/OfflineEventsListWrapper.container';
import EventsListWrapper from '../EventsList/EventsListWrapper.container';

type Props = {
    isOnline: boolean,
};

const EventsListConnectivityWrapper = (props: Props) => (
    <div>
        {
            (() => {
                if (!props.isOnline) {
                    return (
                        <OfflineEventsListWrapper />
                    );
                }
                return (
                    <EventsListWrapper />
                );
            })()
        }
    </div>
);

export default EventsListConnectivityWrapper;
