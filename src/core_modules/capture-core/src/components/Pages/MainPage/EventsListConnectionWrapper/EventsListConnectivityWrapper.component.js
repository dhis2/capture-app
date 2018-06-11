// @flow
import React from 'react';
import OfflineEventsList from '../OfflineEventsList/OfflineEventsList.container';
import EventsList from '../EventsList/EventsList.container';

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
                    <EventsList />
                );
            })()
        }
    </div>
);

export default EventsListConnectivityWrapper;
