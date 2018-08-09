// @flow
import React from 'react';
import OfflineEventsList from '../OfflineEventsList/OfflineEventsList.container';
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
                        <OfflineEventsList />
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
