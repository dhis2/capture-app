// @flow
import React from 'react';
import OfflineEventsList from '../OfflineEventsList/OfflineEventsList.container';
import { SelectorsBuilder } from '../Selectors';

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
                            <SelectorsBuilder />
                        </React.Fragment>
                    );
                })()
            }
        </div>
    );
};

export default EventsListConnectivityWrapper;
