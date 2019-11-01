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

const EventsListConnectivityWrapper = (props: Props) => {
    const { isOnline, ...passOnProps } = props;
    return (
        <div>
            {
                (() => {
                    if (!isOnline) {
                        return (
                            <OfflineEventsList
                                {...passOnProps}
                            />
                        );
                    }
                    return (
                        <OnlineEventsListWithHeader
                            {...passOnProps}
                        />
                    );
                })()
            }
        </div>
    );
};

export default EventsListConnectivityWrapper;
