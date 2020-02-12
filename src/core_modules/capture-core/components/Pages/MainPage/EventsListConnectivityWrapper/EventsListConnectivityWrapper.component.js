// @flow
import React from 'react';
import OfflineEventsList from '../OfflineEventsList/OfflineEventsList.container';
import WorkingListConfigSelector from '../EventsList/WorkingListConfigSelector/WorkingListConfigSelector.container';
import withListHeaderWrapper from '../ListHeaderWrapper/withListHeaderWrapper';
import withEventsListHeader from '../EventsList/Header/withHeader';
import { WorkingLists } from '../WorkingLists';

type Props = {
    isOnline: boolean,
    listId: string,
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
                        <React.Fragment>
                            {/*<OnlineEventsListWithHeader
                                {...passOnProps}
                            />*/}
                            <WorkingLists />
                        </React.Fragment>
                    );
                })()
            }
        </div>
    );
};

export default EventsListConnectivityWrapper;
