// @flow
import * as React from 'react';
import WorkingLists from './WorkingLists.container';

type Props = {

};

const WorkingListsSetup = (props: Props) => {
    const { ...passOnProps } = props;
    return (
        <WorkingLists
            listId="eventList"
        />
    );
};

export default WorkingListsSetup;
