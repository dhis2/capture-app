// @flow
import React from 'react';
import OfflineEventsListWrapper from '../OfflineEventsList/OfflineEventsListWrapper.container';
import EventsListLoadWrapper from '../EventsList/EventsListLoadWrapper.container';

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
                    <EventsListLoadWrapper />
                );
            })()
        }
    </div>
);

export default EventsListConnectivityWrapper;
