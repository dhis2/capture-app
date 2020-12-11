// @flow
import React from 'react';
import OfflineEventsList from '../OfflineEventsList/OfflineEventsList.container';
import { withWorkingListsHeader } from '../WorkingListsHeaderHOC';
import { WorkingListsOnHoldWrapper } from '../WorkingListsOnHoldWrapper';

const WorkingListsWithHeader = withWorkingListsHeader()(WorkingListsOnHoldWrapper);

type Props = {
  isOnline: boolean,
  listId: string,
};

const EventsListConnectivityWrapper = (props: Props) => {
  const { isOnline, ...passOnProps } = props;
  return (
    <div>
      {(() => {
        if (!isOnline) {
          return <OfflineEventsList {...passOnProps} />;
        }
        return (
          <>
            <WorkingListsWithHeader />
          </>
        );
      })()}
    </div>
  );
};

export default EventsListConnectivityWrapper;
