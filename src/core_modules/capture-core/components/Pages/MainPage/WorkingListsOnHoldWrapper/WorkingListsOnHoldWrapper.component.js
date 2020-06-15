// @flow
import * as React from 'react';
import { withLoadingIndicator } from '../../../../HOC';
import { EventWorkingLists } from '../EventWorkingLists';

const EventWorkingListsSetupWithLoadingIndicator = withLoadingIndicator()(EventWorkingLists);

type Props = {
    onHold: boolean,
};

const WorkingListsOnHoldWrapper = (props: Props) => {
    const { onHold } = props;
    return (
        <EventWorkingListsSetupWithLoadingIndicator
            ready={!onHold}
        />
    );
};

export default WorkingListsOnHoldWrapper;
