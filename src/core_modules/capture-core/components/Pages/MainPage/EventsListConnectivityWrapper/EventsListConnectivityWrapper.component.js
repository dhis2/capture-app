// @flow
import React from 'react';
import OfflineEventsList from '../OfflineEventsList/OfflineEventsList.container';
import WorkingListConfigSelector from '../EventsList/WorkingListConfigSelector/WorkingListConfigSelector.container';
import withListHeaderWrapper from '../ListHeaderWrapper/withListHeaderWrapper';
import withEventsListHeader from '../EventsList/Header/withHeader';
import { WorkingListsOnHoldWrapper } from '../WorkingListsOnHoldWrapper';

type Props = {
    isOnline: boolean,
    listId: string,
};

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
                            <WorkingListsOnHoldWrapper />
                        </React.Fragment>
                    );
                })()
            }
        </div>
    );
};

export default EventsListConnectivityWrapper;
